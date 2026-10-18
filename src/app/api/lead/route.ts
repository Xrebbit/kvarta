import { NextRequest, NextResponse } from 'next/server';
import { normalizePhone } from '@/lib/validate-phone';
import { checkIpLimit, checkRateLimit, clearSubmission, recordSubmission } from '@/lib/rate-limit';
import { saveLead, type Lead } from '@/lib/storage';
import { sendToTelegram } from '@/lib/telegram';

const INTERESTS = ['subscription', 'one-time', 'question'];
const MAX_BODY_BYTES = 10000;

function reject(status: number, message: string): NextResponse {
  return NextResponse.json({ success: false, message }, { status });
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

function optionalString(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!isSameOrigin(req)) {
      return reject(403, 'Запрос отклонён');
    }

    if (!(req.headers.get('content-type') ?? '').includes('application/json')) {
      return reject(415, 'Неподдерживаемый формат запроса');
    }

    const ipLimit = checkIpLimit(getClientIp(req));
    if (!ipLimit.allowed) {
      const minutes = Math.ceil((ipLimit.retryAfterMs ?? 0) / 60000);
      return reject(429, `Слишком много запросов. Попробуйте через ${minutes} минут.`);
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return reject(413, 'Слишком большой запрос');
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return reject(400, 'Некорректные данные');
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return reject(400, 'Некорректные данные');
    }

    if (body.website) {
      return NextResponse.json(
          { success: false, message: 'Bot detected' },
          { status: 400 }
      );
    }

    const name = optionalString(body?.name, 100);
    if (name.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Имя должно содержать минимум 2 символа' },
        { status: 400 }
      );
    }

    if (!/^\p{L}[\p{L}\s'’.-]*$/u.test(name)) {
      return NextResponse.json(
        { success: false, message: 'Имя может содержать только буквы' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(typeof body.phone === 'string' ? body.phone : '');
    if (normalizedPhone === null) {
      return NextResponse.json(
        {
          success: false,
          message: 'Введите корректный белорусский номер (например, +375 29 123-45-67)',
        },
        { status: 400 }
      );
    }

    const interest = body?.interest;
    if (typeof interest !== 'string' || !INTERESTS.includes(interest)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Выберите, что вас интересует: подписка, разовый заказ или вопрос',
        },
        { status: 400 }
      );
    }

    const limit = checkRateLimit(normalizedPhone);
    if (!limit.allowed) {
      const minutes = Math.ceil((limit.retryAfterMs ?? 0) / 60000);
      return NextResponse.json(
        {
          success: false,
          message: `Вы уже отправляли заявку недавно. Попробуйте через ${minutes} минут или позвоните нам напрямую.`,
        },
        { status: 429 }
      );
    }

    const comment = optionalString(body?.comment, 1000);
    const utmSource = optionalString(body?.utm_source);
    const utmMedium = optionalString(body?.utm_medium);
    const utmCampaign = optionalString(body?.utm_campaign);
    const utmContent = optionalString(body?.utm_content);
    const referrer = optionalString(body?.referrer, 500);
    const page = optionalString(body?.page, 500);

    const lead: Lead = {
      id: Date.now(),
      name,
      phone: normalizedPhone,
      interest,
      comment,
      utm: {
        source: utmSource || 'direct',
        medium: utmMedium || 'none',
        campaign: utmCampaign || 'none',
        content: utmContent,
      },
      referrer: referrer || 'direct',
      page: page || 'unknown',
      createdAt: new Date().toISOString(),
    };

    recordSubmission(normalizedPhone);

    let saved = false;
    try {
      saveLead(lead);
      saved = true;
    } catch (error) {
      console.error('Не удалось сохранить заявку в файл', error);
    }

    const notified = await sendToTelegram(lead);

    if (!saved && !notified) {
      clearSubmission(normalizedPhone);
      return NextResponse.json(
        {
          success: false,
          message: 'Не удалось обработать заявку. Попробуйте позже или позвоните нам напрямую.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Заявка принята. Мы перезвоним вам в ближайшее время.',
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Не удалось обработать заявку. Попробуйте позже или позвоните нам напрямую.',
      },
      { status: 500 }
    );
  }
}
