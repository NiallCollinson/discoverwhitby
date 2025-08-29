import { notFound } from "next/navigation";

type SearchHit = {
  propId?: number;
  roomId?: number;
  name: string;
  totalPrice?: number;
  nightlyFrom?: number;
  minStay?: number;
  maxGuests?: number;
};

export default async function ResultsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const checkIn = String(searchParams.checkIn ?? "");
  const checkOut = String(searchParams.checkOut ?? "");
  const adults = Number(searchParams.adults ?? 2);
  const children = Number(searchParams.children ?? 0);
  if (!checkIn || !checkOut) return notFound();

  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/search-availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checkIn, checkOut, adults, children }),
    cache: "no-store",
  });
  const hits = (r.ok ? ((await r.json()) as SearchHit[]) : []) || [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Available stays</h1>
      <div className="mt-1 text-sm text-gray-600">{checkIn} → {checkOut} · {adults} adults{children ? `, ${children} children` : ""}</div>
      {hits.length === 0 ? (
        <div className="mt-8 text-gray-600">No availability for your dates. Try adjusting your search.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hits.map((h, i) => (
            <div key={`${h.propId}-${h.roomId}-${i}`} className="rounded-lg border p-4">
              <div className="text-base font-medium">{h.name}</div>
              <div className="mt-1 text-sm text-gray-600">Up to {h.maxGuests ?? "?"} guests</div>
              <div className="mt-3 text-sm">{h.totalPrice ? `£${Math.round(Number(h.totalPrice))} total` : h.nightlyFrom ? `from £${Math.round(Number(h.nightlyFrom))}/night` : "Price on request"}</div>
              {typeof h.minStay === "number" && h.minStay > 1 ? (
                <div className="mt-1 text-xs text-orange-600">Minimum {h.minStay} nights</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}


