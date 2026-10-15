import { NextRequest, NextResponse } from 'next/server';
import { normalizePhone } from '@/lib/validate-phone';
import { checkRateLimit, recordSubmission } from '@/lib/rate-limit';
import { saveLead, type Lead } from '@/lib/storage';
import { sendToTelegram } from '@/lib/telegram';

const INTERESTS = ['subscription', 'one-time', 'question'];

function optionalString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();

        const name = optionalString(body?.name);
        if (name.length < 2) {
            return NextResponse.json(
                { success: false, message: 'Имя должно содержать минимум 2 символа' },
                { status: 400 }
            );
        }

        const normalizedPhone = normalizePhone(body?.phone);
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

        const comment = optionalString(body?.comment);
        const utmSource = optionalString(body?.utm_source);
        const utmMedium = optionalString(body?.utm_medium);
        const utmCampaign = optionalString(body?.utm_campaign);
        const utmContent = optionalString(body?.utm_content);
        const referrer = optionalString(body?.referrer);

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
            createdAt: new Date().toISOString(),
        };

        recordSubmission(normalizedPhone);

        try {
            saveLead(lead);
        } catch (error) {
            console.error('Не удалось сохранить заявку в файл', error);
        }

        await sendToTelegram(lead);

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