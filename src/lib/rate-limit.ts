import { createHash } from 'crypto';
import { isUpstashConfigured, redisCommand, redisPipeline } from '@/lib/upstash';

export type LimitResult = { allowed: true } | { allowed: false; retryAfterMs: number };

const WINDOW_SECONDS = 600;
const WINDOW_MS = WINDOW_SECONDS * 1000;
const IP_MAX_REQUESTS = 10;
const MAX_TRACKED = 10000;

function hashKey(prefix: string, value: string): string {
  return `kvarta:${prefix}:${createHash('sha256').update(value).digest('hex').slice(0, 32)}`;
}

function logFallback(error: unknown): void {
  console.error(
    'Upstash недоступен, лимиты работают в памяти:',
    error instanceof Error ? error.message : 'unknown'
  );
}

const memoryPhones = new Map<string, number>();
const memoryIps = new Map<string, number[]>();

function pruneMemory(): void {
  const now = Date.now();
  memoryPhones.forEach((time, key) => {
    if (now - time >= WINDOW_MS) memoryPhones.delete(key);
  });
  if (memoryPhones.size > MAX_TRACKED) memoryPhones.clear();
  if (memoryIps.size > MAX_TRACKED) memoryIps.clear();
}

function reservePhoneInMemory(phone: string): LimitResult {
  const now = Date.now();
  const last = memoryPhones.get(phone);
  if (last !== undefined && now - last < WINDOW_MS) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - last) };
  }
  if (memoryPhones.size >= MAX_TRACKED) pruneMemory();
  memoryPhones.set(phone, now);
  return { allowed: true };
}

function checkIpInMemory(ip: string): LimitResult {
  const now = Date.now();
  const recent = (memoryIps.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= IP_MAX_REQUESTS) {
    memoryIps.set(ip, recent);
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - recent[0]) };
  }
  recent.push(now);
  if (memoryIps.size >= MAX_TRACKED) pruneMemory();
  memoryIps.set(ip, recent);
  return { allowed: true };
}

/**
 * Атомарно «занимает» номер на 10 минут. Первый запрос проходит,
 * повторный (в том числе двойной клик и параллельные экземпляры) получает отказ.
 */
export async function reservePhone(phone: string): Promise<LimitResult> {
  if (isUpstashConfigured()) {
    try {
      const key = hashKey('phone', phone);
      const set = await redisCommand(['SET', key, '1', 'NX', 'EX', WINDOW_SECONDS]);
      if (set === 'OK') return { allowed: true };
      const ttl = Number(await redisCommand(['PTTL', key]));
      return { allowed: false, retryAfterMs: ttl > 0 ? ttl : WINDOW_MS };
    } catch (error) {
      logFallback(error);
    }
  }
  return reservePhoneInMemory(phone);
}

/** Снимает занятость номера, если заявка не была доставлена ни одним каналом. */
export async function releasePhone(phone: string): Promise<void> {
  memoryPhones.delete(phone);
  if (!isUpstashConfigured()) return;
  try {
    await redisCommand(['DEL', hashKey('phone', phone)]);
  } catch (error) {
    logFallback(error);
  }
}

/** Не больше 10 запросов с одного IP за 10 минут. */
export async function checkIp(ip: string): Promise<LimitResult> {
  if (isUpstashConfigured()) {
    try {
      const key = hashKey('ip', ip);
      const [count, , ttl] = await redisPipeline([
        ['INCR', key],
        ['EXPIRE', key, WINDOW_SECONDS, 'NX'],
        ['PTTL', key],
      ]);
      if (Number(count) > IP_MAX_REQUESTS) {
        const wait = Number(ttl);
        return { allowed: false, retryAfterMs: wait > 0 ? wait : WINDOW_MS };
      }
      return { allowed: true };
    } catch (error) {
      logFallback(error);
    }
  }
  return checkIpInMemory(ip);
}
