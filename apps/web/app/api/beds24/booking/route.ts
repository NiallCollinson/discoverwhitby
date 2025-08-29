import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { propertyId, checkIn, checkOut, guests, guest } = body || {};
    if (!propertyId || !checkIn || !checkOut || !guest?.email || !guest?.name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const baseUrl = process.env.BEDS24_BASE_URL || "https://beds24.com/api/v2";
    const account = process.env.BEDS24_ACCOUNT;
    const token = process.env.BEDS24_ACCESS_TOKEN;
    if (!token || !account) return NextResponse.json({ error: "Beds24 not configured" }, { status: 503 });

    // Example: create booking endpoint (adjust to actual path/body per docs)
    const url = new URL(baseUrl.replace(/\/$/, "") + "/bookings");
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", token },
      body: JSON.stringify({
        accountId: String(account),
        propertyId: String(propertyId),
        checkIn,
        checkOut,
        guests,
        guest,
        currency: "GBP",
        payStatus: "paid",
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `Beds24 error ${res.status}`, detail: txt.slice(0, 500) }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}



