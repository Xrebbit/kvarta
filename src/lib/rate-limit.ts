const WINDOW_MS = 600000;
const MAX_TRACKED = 10000;

const lastSubmissions = new Map<string, number>();

function prune(map: Map<string, number>): void {
  const now = Date.now();
  map.forEach((time, key) => {
    if (now - time >= WINDOW_MS) map.delete(key);
  });
  if (map.size > MAX_TRACKED) map.clear();
}

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
  if (lastSubmissions.size >= MAX_TRACKED) prune(lastSubmissions);
  lastSubmissions.set(phone, Date.now());
}

export function clearSubmission(phone: string): void {
  lastSubmissions.delete(phone);
}

const IP_MAX_REQUESTS = 10;
const ipHits = new Map<string, number[]>();

export function checkIpLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= IP_MAX_REQUESTS) {
    ipHits.set(ip, recent);
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - recent[0]) };
  }

  recent.push(now);

  if (ipHits.size >= MAX_TRACKED) {
    ipHits.forEach((times, key) => {
      if (times.every((time) => now - time >= WINDOW_MS)) ipHits.delete(key);
    });
    if (ipHits.size >= MAX_TRACKED) ipHits.clear();
  }

  ipHits.set(ip, recent);
  return { allowed: true };
}
