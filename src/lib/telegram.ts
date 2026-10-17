import type { Lead } from '@/lib/storage';

const REQUEST_TIMEOUT_MS = 8000;

const INTEREST_LABELS: Record<string, string> = {
  subscription: 'Подписка',
  'one-time': 'Разовый заказ',
  question: 'Вопрос',
};

function buildMessage(lead: Lead): string {
  const interestLabel = INTEREST_LABELS[lead.interest] ?? lead.interest;
  const time = new Date(lead.createdAt).toLocaleString('ru-RU', {
    timeZone: 'Europe/Minsk',
  });

  const lines = [
    'Новая заявка с сайта Кварта',
    '',
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Интерес: ${interestLabel}`,
  ];

  if (lead.comment) {
    lines.push(`Комментарий: ${lead.comment}`);
  }

  lines.push(
    '',
    `Источник: ${lead.utm.source} / ${lead.utm.medium}`,
    `Кампания: ${lead.utm.campaign}`,
    `Объявление: ${lead.utm.content || 'не указано'}`,
    `Страница: ${lead.page}`,
    `Referrer: ${lead.referrer}`,
    `Время: ${time}`
  );

  return lines.join('\n');
}

export async function sendToTelegram(lead: Lead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram: не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID, уведомление пропущено');
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: buildMessage(lead) }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`Telegram: ошибка ${response.status}`, details);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Telegram: не удалось отправить сообщение', error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
