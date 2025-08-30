import { NextResponse } from "next/server";

function toISO(d: Date): string {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const propertyId = url.searchParams.get("propertyId") || "132982"; // Bluegrass Cottage default
  const adults = Number(url.searchParams.get("adults") || 2);
  const children = Number(url.searchParams.get("children") || 0);
  const fromStr = url.searchParams.get("from") || toISO(new Date());
  const toStr = url.searchParams.get("to") || toISO(new Date(new Date().getTime() + 13 * 86400000));

  const token = process.env.BEDS24_API_TOKEN || process.env.BEDS24_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ error: "Missing Beds24 token" }, { status: 500 });

  const start = new Date(fromStr);
  const end = new Date(toStr);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const days: Record<string, { available: boolean; price: number | null }> = {};
  function collectPriceCandidates(input: any, depth = 0, out: number[] = []): number[] {
    if (!input || depth > 3) return out;
    if (typeof input === "number" && Number.isFinite(input)) {
      out.push(input);
      return out;
    }
    if (typeof input !== "object") return out;
    for (const [k, v] of Object.entries(input)) {
      const key = k.toLowerCase();
      // only recurse into likely price/amount containers to avoid noise
      if (typeof v === "number" && Number.isFinite(v)) {
        if (/price|total|amount|night|net|gross|rate/.test(key)) out.push(v as number);
      } else if (typeof v === "object") {
        if (/price|total|amount|night|net|gross|rate|offer/.test(key)) collectPriceCandidates(v, depth + 1, out);
      }
    }
    return out;
  }

  for (let d = new Date(start); d <= end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    const checkIn = toISO(d);
    const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const checkOut = toISO(next);
    try {
      const api = new URL("https://beds24.com/api/v2/inventory/rooms/offers");
      api.searchParams.set("propertyId", String(propertyId));
      // Beds24 offers may expect arrival/departure and occupancy[adults|children]
      api.searchParams.set("arrival", checkIn);
      api.searchParams.set("departure", checkOut);
      api.searchParams.set("occupancy[adults]", String(adults));
      api.searchParams.set("occupancy[children]", String(children));

      const r = await fetch(api.toString(), {
        method: "GET",
        headers: { accept: "application/json", token },
        cache: "no-store",
      });
      if (!r.ok) {
        days[checkIn] = { available: false, price: null };
        continue;
      }
      const json: any = await r.json();
      const list: any[] = Array.isArray(json)
        ? json
        : (json?.items ?? json?.data ?? json?.offers ?? json?.result ?? []);
      let best = Number.POSITIVE_INFINITY;
      for (const offer of list) {
        const nums = collectPriceCandidates(offer);
        for (const num of nums) {
          if (num > 0 && Number.isFinite(num)) best = Math.min(best, num);
        }
      }
      const available = (list?.length ?? 0) > 0;
      const price = available && best !== Number.POSITIVE_INFINITY ? Math.round(best) : null;
      days[checkIn] = { available, price };
    } catch {
      days[checkIn] = { available: false, price: null };
    }
  }

  return NextResponse.json({ days });
}


