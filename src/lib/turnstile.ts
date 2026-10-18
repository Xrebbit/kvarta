export type TurnstileResult = 'skipped' | 'passed' | 'failed' | 'unavailable';

const DEFAULT_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const REQUEST_TIMEOUT_MS = 5000;
const MAX_TOKEN_LENGTH = 2048;

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: unknown, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return 'skipped';

  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return 'failed';
  }

  const form = new URLSearchParams({ secret, response: token });
  if (ip && ip !== 'unknown') form.set('remoteip', ip);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(process.env.TURNSTILE_VERIFY_URL ?? DEFAULT_VERIFY_URL, {
      method: 'POST',
      body: form,
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Turnstile: статус ${response.status}`);
      return 'unavailable';
    }

    const data = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success === true) return 'passed';

    console.warn('Turnstile: проверка не пройдена', data['error-codes']?.join(',') ?? '');
    return 'failed';
  } catch (error) {
    console.error('Turnstile: не удалось связаться с Cloudflare', error instanceof Error ? error.name : 'unknown');
    return 'unavailable';
  } finally {
    clearTimeout(timeout);
  }
}
