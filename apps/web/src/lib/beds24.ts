// Server-side Beds24 helpers (V2 + simple cache)
// NOTE: Keep secrets server-only. Do not import this in client components.

export type CalendarMeta = Record<string, { price: number | null; available: boolean }>;

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const v2Cache = new Map<string, { expires: number; data: any }>();

function makeCacheKey(path: string, params: Record<string, string | number | undefined>) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("&");
  return `${path}?${qs}`;
}

export async function beds24V2Get(path: string, params: Record<string, string | number | undefined>) {
  const base = process.env.BEDS24_V2_BASE_URL || "https://api.beds24.com";
  const url = new URL(path, base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, String(v));
  });

  const key = makeCacheKey(path, params);
  const now = Date.now();
  const cached = v2Cache.get(key);
  if (cached && cached.expires > now) return cached.data;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  // Typical V2 auth headers; adjust to your Beds24 account configuration.
  if (process.env.BEDS24_V2_API_KEY) headers["X-API-KEY"] = String(process.env.BEDS24_V2_API_KEY);
  if (process.env.BEDS24_V2_ACCOUNT_ID) headers["X-ACCOUNT-ID"] = String(process.env.BEDS24_V2_ACCOUNT_ID);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Beds24 V2 error ${res.status}`);
  const json = await res.json();
  v2Cache.set(key, { expires: now + SIX_HOURS_MS, data: json });
  return json;
}

export function coalesceCalendarToMeta(json: any): CalendarMeta {
  // Defensive parsing: expect structures like { days: [{ date, rooms:[{available, price}]}] } or
  // { calendar: { "YYYY-MM-DD": [{ available, price }, ...] } }
  const out: CalendarMeta = {};
  try {
    const daysArr: any[] = Array.isArray(json?.days)
      ? json.days
      : json?.calendar && typeof json.calendar === "object"
      ? Object.entries(json.calendar).map(([date, rows]: [string, any]) => ({ date, rooms: rows }))
      : [];
    for (const d of daysArr) {
      const date = String(d?.date ?? d?.day ?? "");
      if (!date) continue;
      const rows: any[] = Array.isArray(d?.rooms) ? d.rooms : Array.isArray(d) ? d : [];
      let available = false;
      let best = Number.POSITIVE_INFINITY;
      for (const r of rows) {
        const isAvail = Boolean(r?.available ?? (typeof r?.inventory === "number" ? r.inventory > 0 : false));
        if (isAvail) available = true;
        const price = Number(r?.price ?? r?.rate ?? r?.total ?? r?.nightly);
        if (!Number.isNaN(price)) best = Math.min(best, price);
      }
      out[date] = { available, price: available && best !== Number.POSITIVE_INFINITY ? best : null };
    }
  } catch {
    // ignore
  }
  return out;
}


