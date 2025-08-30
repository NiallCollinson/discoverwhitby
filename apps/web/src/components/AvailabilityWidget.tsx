"use client";

import { useEffect, useState } from "react";

type Day = { date: string; available?: boolean; price?: number };

export default function AvailabilityWidget({ propertyId, slug }: { propertyId: string; slug: string }) {
  const [days, setDays] = useState<Day[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function run() {
      setError(null);
      try {
        const today = new Date();
        const toIso = (d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
        const from = toIso(today);
        const to = toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13));
        const url = `/api/beds24/daily?propertyId=${encodeURIComponent(propertyId)}&from=${from}&to=${to}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load availability");
        const json = (await res.json()) as { days: Record<string, { available: boolean; price: number | null }> };
        const mapped: Day[] = Object.entries(json.days || {}).map(([date, v]) => ({ date, available: v.available, price: v.price ?? undefined }));
        if (!ignore) setDays(mapped);
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? "Error");
      }
    }
    run();
    return () => { ignore = true; };
  }, [propertyId, slug]);

  return (
    <div className="mt-8 rounded-lg border border-gray-200 p-4">
      <div className="text-lg font-semibold">Availability (next 14 days)</div>
      {error ? (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      ) : days.length === 0 ? (
        <div className="mt-2 text-sm text-gray-600">Loading…</div>
      ) : (
        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm">
          {days.map((d) => (
            <div key={d.date} className={`rounded border px-2 py-3 ${d.available ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"}`}>
              <div className="font-medium">{new Date(d.date).getDate()}</div>
              <div className="text-xs">{d.available ? "Available" : "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


