import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { propertyId, checkIn, checkOut, guests } = await req.json();
    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing propertyId/checkIn/checkOut" }, { status: 400 });
    }
    const baseUrl = process.env.BEDS24_BASE_URL || "https://beds24.com/api/v2";
    const account = process.env.BEDS24_ACCOUNT;
    const token = process.env.BEDS24_ACCESS_TOKEN;
    if (!token || !account) return NextResponse.json({ error: "Beds24 not configured" }, { status: 503 });

    // Example: GET /quote or /availability endpoint (adjust path/params per docs)
    const url = new URL(baseUrl.replace(/\/$/, "") + "/availability");
    url.searchParams.set("accountId", String(account));
    url.searchParams.set("account", String(account));
    url.searchParams.set("propertyId", String(propertyId));
    url.searchParams.set("checkIn", String(checkIn));
    url.searchParams.set("checkOut", String(checkOut));
    if (guests) url.searchParams.set("guests", String(guests));

    const res = await fetch(url.toString(), { headers: { Accept: "application/json", token } });
    if (!res.ok) {
      return NextResponse.json({ error: `Beds24 error ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}



