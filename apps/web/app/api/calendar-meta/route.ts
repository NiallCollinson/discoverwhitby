import { NextResponse } from "next/server";
import { beds24V2Get, coalesceCalendarToMeta } from "@/src/lib/beds24";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const monthStart = url.searchParams.get("monthStart");
    const monthEnd = url.searchParams.get("monthEnd");
    const propIds = url.searchParams.getAll("propIds").flatMap((s) => s.split(",").filter(Boolean));
    if (!monthStart || !monthEnd) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    // Example V2 path & params – adjust to your Beds24 account
    const path = "/inventory/rooms/calendar";
    const params: Record<string, string> = {
      start: monthStart,
      end: monthEnd,
    };
    if (propIds.length) params["propIds"] = propIds.join(",");

    const json = await beds24V2Get(path, params);
    const meta = coalesceCalendarToMeta(json);
    return NextResponse.json(meta);
  } catch (e) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}


