const WINDOW_MS = 600000;

const lastSubmissions = new Map<string, number>();

export function checkRateLimit(phone: string): { allowed: boolean; retryAfterMs?: number } {
  const last = lastSubmissions.get(phone);

  if (last === undefined) {
    return { allowed: true };
  }

  const elapsed = Date.now() - last;

  if (elapsed < WINDOW_MS) {
    return { allowed: false, retryAfterMs: WINDOW_MS - elapsed };
  }

  return { allowed: true };
}

export function recordSubmission(phone: string): void {
  lastSubmissions.set(phone, Date.now());
}

export function clearSubmission(phone: string): void {
  lastSubmissions.delete(phone);
}
