"use client";

import { useEffect, useMemo, useState } from "react";

export default function PropertyBooking({ propertyId }: { propertyId: string }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [quote, setQuote] = useState<any>(null);
  const canQuote = useMemo(() => Boolean(propertyId && checkIn && checkOut), [propertyId, checkIn, checkOut]);

  async function fetchQuote() {
    if (!canQuote) return;
    const res = await fetch("/api/beds24/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, checkIn, checkOut, guests }),
    });
    const data = await res.json();
    setQuote(data);
  }

  async function book() {
    const name = (document.getElementById("guestName") as HTMLInputElement)?.value;
    const email = (document.getElementById("guestEmail") as HTMLInputElement)?.value;
    const phone = (document.getElementById("guestPhone") as HTMLInputElement)?.value;
    if (!name || !email) return alert("Enter name and email");
    const res = await fetch("/api/beds24/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, checkIn, checkOut, guests, guest: { name, email, phone } }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Booking failed");
    alert("Booking created");
  }

  useEffect(() => {
    setQuote(null);
  }, [checkIn, checkOut, guests]);

  return (
    <div className="mt-8 rounded-lg border border-gray-200 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Check-in</label>
          <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Check-out</label>
          <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Guests</label>
          <input type="number" min={1} className="mt-1 w-full rounded-md border px-3 py-2" value={guests} onChange={(e) => setGuests(parseInt(e.target.value || "1", 10))} />
        </div>
        <div className="flex items-end">
          <button onClick={fetchQuote} disabled={!canQuote} className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50">Get price</button>
        </div>
      </div>

      {quote ? (
        <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
          <div className="font-medium">Quote</div>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(quote, null, 2)}</pre>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Guest name</label>
          <input id="guestName" className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Full name" />
        </div>
        <div>
          <label className="text-sm font-medium">Guest email</label>
          <input id="guestEmail" type="email" className="mt-1 w-full rounded-md border px-3 py-2" placeholder="you@example.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Phone (optional)</label>
          <input id="guestPhone" className="mt-1 w-full rounded-md border px-3 py-2" placeholder="+44..." />
        </div>
      </div>

      <div className="mt-4">
        <button onClick={book} disabled={!canQuote} className="rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-50">Book now</button>
      </div>
    </div>
  );
}





