const BY_COUNTRY_CODE = "375";
const SUBSCRIBER_LENGTH = 9;
const VALID_CODES = ["25", "29", "33", "44", "15", "16", "17", "21", "22", "23"];

function isKnownCode(subscriber: string): boolean {
  return VALID_CODES.includes(subscriber.slice(0, 2));
}

export function normalizePhone(raw: string): string | null {
  if (typeof raw !== "string" || raw.length === 0) {
    return null;
  }

  const cleaned = raw.replace(/[^\d+]/g, "");

  if (cleaned.length === 0) {
    return null;
  }

  const hasPlus = cleaned.startsWith("+");
  const body = hasPlus ? cleaned.slice(1) : cleaned;

  if (!/^\d+$/.test(body)) {
    return null;
  }

  if (body.startsWith(BY_COUNTRY_CODE)) {
    const subscriber = body.slice(BY_COUNTRY_CODE.length);
    if (subscriber.length !== SUBSCRIBER_LENGTH || !isKnownCode(subscriber)) {
      return null;
    }
    return `+${BY_COUNTRY_CODE}${subscriber}`;
  }

  if (!hasPlus && body.startsWith("80")) {
    const subscriber = body.slice(2);
    if (subscriber.length !== SUBSCRIBER_LENGTH || !isKnownCode(subscriber)) {
      return null;
    }
    return `+${BY_COUNTRY_CODE}${subscriber}`;
  }

  return null;
}

export function isValidBelarusianPhone(raw: string): boolean {
  return normalizePhone(raw) !== null;
}

// Примеры валидных номеров:
// +375291234567 → +375291234567
// 375291234567 → +375291234567
// 80291234567 → +375291234567
// +375 (29) 123-45-67 → +375291234567
// 8(029)123-45-67 → +375291234567

// Примеры невалидных:
// +79991234567 → null (Россия)
// +380291234567 → null (Украина)
// +37529123 → null (короткий)
// +375791234567 → null (неизвестный код оператора)
// "" → null
