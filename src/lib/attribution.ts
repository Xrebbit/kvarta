const STORAGE_KEY = 'kvarta:attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

export type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  referrer: string;
  page: string;
};

function readStored(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function buildCurrent(previous: Attribution | null, keepReferrer: boolean): Attribution {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_content: params.get('utm_content') ?? '',
    referrer: keepReferrer && previous ? previous.referrer : document.referrer,
    page: window.location.origin + window.location.pathname + window.location.search,
  };
}

export function captureAttribution(): void {
  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some((key) => params.get(key));
  const stored = readStored();

  if (stored && !hasUtm) return;

  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(buildCurrent(stored, false))
    );
  } catch {
    return;
  }
}

export function getAttribution(): Attribution {
  return readStored() ?? buildCurrent(null, false);
}
