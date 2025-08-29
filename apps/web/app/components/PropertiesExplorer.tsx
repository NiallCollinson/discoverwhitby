"use client";

import { useMemo, useState, useEffect } from "react";
import CardImage from "@/app/components/CardImage";
import dynamic from "next/dynamic";
import { useState } from "react";
const PriceCalendar = dynamic(() => import("@/src/components/PriceCalendar"), { ssr: false });

type PropertyLite = {
  id: string;
  slug: string;
  title: string;
  priceNight: number;
  bedrooms: number;
  maxGuests: number;
  coverImage?: string;
};

export function PropertiesExplorer({ items, hasDb }: { items: PropertyLite[]; hasDb: boolean }) {
  const [query, setQuery] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const guestsParam = url.searchParams.get("guests") ?? "";
      setGuests(guestsParam);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const current = new URL(window.location.href);
      const params = current.searchParams;
      if (guests) params.set("guests", guests); else params.delete("guests");
      current.search = params.toString();
      current.hash = "search";
      window.history.replaceState({}, "", current.toString());
    } catch {}
  }, [guests]);

  const filtered = useMemo(() => {
    const guestsNum = guests ? Number(guests) : undefined;
    return items.filter((p) => {
      if (guestsNum && Number.isFinite(guestsNum) && p.maxGuests < guestsNum) return false;
      return true;
    });
  }, [items, guests]);

  return (
    <div id="search" className="mx-auto max-w-7xl bg-white px-6 py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 relative">
          <div className="text-sm font-medium">Dates</div>
          <button
            type="button"
            className="mt-2 w-full rounded-md border px-3 py-2 text-left"
            onClick={() => setCalendarOpen((v) => !v)}
          >
            Add dates
          </button>
          {calendarOpen ? (
            <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl border bg-white p-2 shadow-xl">
              <PriceCalendar />
            </div>
          ) : null}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm font-medium">Guests</div>
          <input
            className="mt-2 w-full rounded-md border px-3 py-2"
            placeholder="2 guests"
            inputMode="numeric"
            value={guests}
            onChange={(e) => setGuests(e.target.value.replace(/[^0-9]/g, ""))}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
          <span aria-hidden>🐾</span>
          <span>PET FRIENDLY</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
          <span aria-hidden>🅿️</span>
          <span>PARKING</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
          <span aria-hidden>💷</span>
          <span>FANTASTIC VALUE</span>
        </div>
      </div>

      

      {filtered.length === 0 ? (
        <div className="text-gray-500">No properties match your search.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <a key={p.id} href={`/property/${p.slug}`} className="group rounded-lg border border-gray-200 bg-white p-4">
              <CardImage slug={p.slug} alt={p.title} cover={p.coverImage} />
              <div className="mt-3 flex items-center justify-between">
                <div className="text-base font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">£{p.priceNight}/night</div>
              </div>
              <div className="mt-1 text-sm text-gray-600">{p.bedrooms} bed · {p.maxGuests} guests</div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6 text-center">
        <div className="text-lg font-semibold">The longer the stay, the bigger the discount</div>
        <div className="mt-2 text-sm text-gray-600">Save more when you book 7+ nights.</div>
      </div>

      <div className="mt-12 grid gap-6">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-[url('/hero-whitby.mp4')] bg-cover bg-center p-10">
          <div className="max-w-2xl">
            <div className="text-2xl font-semibold text-black">Cottages</div>
            <p className="mt-1 text-black/80">Cosy stays with charm and character.</p>
            <a href={`/?q=cottage#search`} className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white">Explore cottages</a>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="text-xl font-semibold">Free parking</div>
            <p className="mt-1 text-gray-600">Stays with on-site parking included.</p>
            <a href={`/?q=parking#search`} className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white">View homes</a>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="text-xl font-semibold">Large houses</div>
            <p className="mt-1 text-gray-600">Space for the whole group.</p>
            <a href={`/?q=large%20house#search`} className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white">View homes</a>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <div className="text-xl font-semibold">Why book with us</div>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-gray-700 sm:grid-cols-2">
            <li>Best price guaranteed</li>
            <li>Verified local hosts</li>
            <li>Secure payments</li>
            <li>Flexible cancellation on many stays</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


