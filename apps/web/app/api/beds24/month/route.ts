import { NextResponse } from "next/server";

const cache = new Map<string, { expires: number; data: any }>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const year = Number(url.searchParams.get("year"));
    const month = Number(url.searchParams.get("month")); // 1-12
    const adults = Number(url.searchParams.get("adults") ?? process.env.DEFAULT_ADULTS ?? 2);
    const children = Number(url.searchParams.get("children") ?? process.env.DEFAULT_CHILDREN ?? 0);
    const propId = (url.searchParams.get("propId") ?? process.env.BEDS24_PROP_ID ?? "").toString();
    if (!year || !month || !propId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const key = `${propId}:${adults}:${children}:${year}-${month}`;
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expires > now) return NextResponse.json(cached.data);

    const first = new Date(Date.UTC(year, month - 1, 1));
    const last = new Date(Date.UTC(year, month, 0));
    const dates: Date[] = [];
    for (let d = new Date(first); d <= last; d = new Date(d.getTime() + 86400000)) dates.push(d);

    const results: Array<{ iso: string; available: boolean; price: number | null; minStay: number | null }> = [];
    // Throttle: simple sequential batches of 4
    const CONCURRENCY = 4;
    for (let i = 0; i < dates.length; i += CONCURRENCY) {
      const slice = dates.slice(i, i + CONCURRENCY);
      const batch = await Promise.all(
        slice.map((date) => lookupNight({ date, propId, adults, children }))
      );
      results.push(...batch);
    }

    const days = Object.fromEntries(
      results.map((x) => [x.iso, { available: x.available, price: x.price, minStay: x.minStay ?? null }])
    );
    const data = { days };
    cache.set(key, { expires: now + TTL_MS, data });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function lookupNight({
  date,
  propId,
  adults,
  children,
}: {
  date: Date;
  propId: string;
  adults: number;
  children: number;
}) {
  const checkIn = date.toISOString().slice(0, 10);
  const checkoutDate = new Date(date.getTime() + 86400000);
  const checkOut = checkoutDate.toISOString().slice(0, 10);

  const body = {
    authentication: {
      apiKey: process.env.BEDS24_API_KEY,
      propKey: process.env.BEDS24_PROP_KEY,
    },
    checkIn,
    checkOut,
    propId,
    numAdult: adults,
    numChild: children,
  } as any;

  try {
    const r = await fetch(process.env.BEDS24_API_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!r.ok) return { iso: checkIn, available: false, price: null as number | null, minStay: null as number | null };
    const json = await r.json();
    const { available, price, minStay } = parseAvailabilities(json);
    return { iso: checkIn, available, price, minStay: (minStay as number | undefined) ?? null };
  } catch {
    return { iso: checkIn, available: false, price: null as number | null, minStay: null as number | null };
  }
}

function parseAvailabilities(json: any): { available: boolean; price: number | null; minStay?: number } {
  try {
    const rooms: any[] = json?.data?.rooms ?? json?.rooms ?? json?.availabilities ?? [];
    let best = Number.POSITIVE_INFINITY;
    let has = false;
    let minStay: number | undefined;
    for (const r of rooms) {
      const isAvailable = Boolean(r?.available ?? (typeof r?.inventory === "number" ? r.inventory > 0 : false));
      if (isAvailable) {
        has = true;
        const p = Number(r?.price ?? r?.total ?? r?.nightly ?? r?.priceTotal ?? r?.rate);
        if (!Number.isNaN(p)) best = Math.min(best, p);
      }
      const rMin = Number(r?.minStay ?? r?.minstay ?? r?.minNights);
      if (!Number.isNaN(rMin) && rMin > 0) minStay = Math.max(minStay ?? 0, rMin);
    }
    return { available: has, price: has && best !== Number.POSITIVE_INFINITY ? best : null, minStay };
  } catch {
    return { available: false, price: null };
  }
}


