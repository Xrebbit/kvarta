const BY_COUNTRY_CODE = "375";
const SUBSCRIBER_LENGTH = 9;

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
        if (subscriber.length !== SUBSCRIBER_LENGTH) {
            return null;
        }
        return `+${BY_COUNTRY_CODE}${subscriber}`;
    }

    if (!hasPlus && body.startsWith("80")) {
        const subscriber = body.slice(2);
        if (subscriber.length !== SUBSCRIBER_LENGTH) {
            return null;
        }
        return `+${BY_COUNTRY_CODE}${subscriber}`;
    }

    return null;
}

export function isValidBelarusianPhone(raw: string): boolean {
    return normalizePhone(raw) !== null;
}