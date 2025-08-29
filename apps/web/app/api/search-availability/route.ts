import { NextResponse } from "next/server";

type SearchRequest = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  propIds?: number[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SearchRequest;
    const { checkIn, checkOut, adults, children = 0 } = body || ({} as any);
    if (!checkIn || !checkOut || !adults) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Use JSON V1 getAvailabilities for exact quote for the range
    const payload = {
      authentication: {
        apiKey: process.env.BEDS24_API_KEY,
        propKey: process.env.BEDS24_PROP_KEY,
      },
      checkIn,
      checkOut,
      numAdult: adults,
      numChild: children,
      ownerId: process.env.BEDS24_ACCOUNT_ID, // optional, or send propId
    } as any;

    const r = await fetch(String(process.env.BEDS24_API_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!r.ok) return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    const json = await r.json();

    const hits: any[] = normalizeAvailabilities(json);
    return NextResponse.json(hits);
  } catch (e) {
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}

function normalizeAvailabilities(json: any) {
  const out: any[] = [];
  try {
    const rooms = json?.data?.rooms ?? json?.rooms ?? [];
    for (const r of rooms) {
      if (!(r?.available ?? (typeof r?.inventory === "number" ? r.inventory > 0 : false))) continue;
      out.push({
        propId: Number(r?.propId ?? r?.propertyId ?? 0) || undefined,
        roomId: Number(r?.roomId ?? r?.id ?? 0) || undefined,
        name: String(r?.name ?? r?.roomName ?? r?.title ?? "Room"),
        totalPrice: r?.total ?? r?.priceTotal ?? r?.rate,
        nightlyFrom: r?.nightly ?? r?.price,
        minStay: r?.minStay ?? r?.minNights,
        maxGuests: r?.maxGuests ?? r?.maxPax,
      });
    }
  } catch {}
  return out;
}


