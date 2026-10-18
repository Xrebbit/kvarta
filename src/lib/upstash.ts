type Command = (string | number)[];
type RedisReply = { result?: unknown; error?: string };

const REQUEST_TIMEOUT_MS = 3000;

function config(): { url: string; token: string } {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? '',
  };
}

export function isUpstashConfigured(): boolean {
  const { url, token } = config();
  return Boolean(url && token);
}

async function request(path: string, body: unknown): Promise<unknown> {
  const { url, token } = config();
  const baseUrl = url.replace(/\/+$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Upstash вернул статус ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function redisCommand(command: Command): Promise<unknown> {
  const reply = (await request('', command)) as RedisReply;
  if (reply.error) throw new Error(`Upstash: ${reply.error}`);
  return reply.result;
}

export async function redisPipeline(commands: Command[]): Promise<unknown[]> {
  const replies = (await request('/pipeline', commands)) as RedisReply[];
  return replies.map((reply) => {
    if (reply.error) throw new Error(`Upstash: ${reply.error}`);
    return reply.result;
  });
}
