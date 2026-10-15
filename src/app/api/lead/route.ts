import { NextRequest, NextResponse } from 'next/server';
import { normalizePhone } from '@/lib/validate-phone';
import { checkRateLimit, recordSubmission } from '@/lib/rate-limit';

const INTERESTS = ['subscription', 'one-time', 'question'];

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();

        const name = typeof body?.name === 'string' ? body.name.trim() : '';
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

        const comment = typeof body?.comment === 'string' ? body.comment.trim() : '';

        recordSubmission(normalizedPhone);

        return NextResponse.json(
            {
                success: true,
                message: 'Заявка принята (демо)',
                normalizedPhone,
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