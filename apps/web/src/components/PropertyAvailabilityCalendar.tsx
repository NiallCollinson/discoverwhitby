"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type DayInfo = { available: boolean; price: number | null };
type MonthData = Record<string, DayInfo>; // ISO -> info

function startOfMonth(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}
function endOfMonth(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
}
function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function PropertyAvailabilityCalendar({ propertyId }: { propertyId: string }) {
  const now = useMemo(() => new Date(), []);
  const [visible, setVisible] = useState<Date>(() => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)));
  const [data, setData] = useState<Record<string, MonthData>>({});
  const [range, setRange] = useState<DateRange | undefined>();

  // Fetch current visible month and the following month to support ranges across months
  useEffect(() => {
    const fetchMonth = (d: Date) => {
      const from = startOfMonth(d);
      const to = endOfMonth(d);
      const k = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
      if (data[k]) return;
      const url = `/api/beds24/daily?propertyId=${encodeURIComponent(propertyId)}&from=${toISO(from)}&to=${toISO(to)}`;
      fetch(url, { cache: "no-store" })
        .then((r) => r.json())
        .then((json: { days: MonthData }) => {
          setData((prev) => ({ ...prev, [k]: json.days || {} }));
        })
        .catch(() => {
          setData((prev) => ({ ...prev, [k]: {} }));
        });
    };
    fetchMonth(visible);
    const next = new Date(Date.UTC(visible.getUTCFullYear(), visible.getUTCMonth() + 1, 1));
    fetchMonth(next);
  }, [propertyId, visible, data]);

  const disabled = (day: Date) => {
    const today = new Date();
    const startOfToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const thisDay = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
    if (thisDay < startOfToday) return true;
    const k = `${day.getUTCFullYear()}-${day.getUTCMonth() + 1}`;
    const iso = toISO(thisDay);
    const info = data[k]?.[iso];
    if (!info) return false; // unknown -> allow
    return !info.available;
  };

  const dayContent = (day: Date) => {
    const k = `${day.getUTCFullYear()}-${day.getUTCMonth() + 1}`;
    const iso = toISO(new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate())));
    const info = data[k]?.[iso];
    const price = info?.price != null ? `£${info.price}` : "";
    return (
      <div className="flex flex-col items-center">
        <div>{day.getDate()}</div>
        <div className="text-[10px] leading-tight opacity-80">{price}</div>
      </div>
    );
  };

  function enumerateNights(from?: Date, to?: Date): string[] {
    if (!from || !to) return [];
    const out: string[] = [];
    for (let d = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())); d < new Date(Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())); d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))) {
      out.push(toISO(d));
    }
    return out;
  }

  const selection = useMemo(() => {
    const isoNights = enumerateNights(range?.from, range?.to);
    let total = 0;
    let complete = true;
    for (const iso of isoNights) {
      const [y, m] = iso.split("-");
      const k = `${Number(y)}-${Number(m)}`;
      const info = data[k]?.[iso];
      if (!info || !info.available || info.price == null) {
        complete = false;
        continue;
      }
      total += Number(info.price);
    }
    return { nights: isoNights.length, total: total > 0 ? total : undefined, complete };
  }, [range, data]);

  return (
    <div className="rounded-2xl border p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          month={visible}
          onMonthChange={(d) => setVisible(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1)))}
          numberOfMonths={2}
          fixedWeeks
          showOutsideDays
          disabled={disabled}
          components={{ DayContent: (props) => dayContent(props.date) }}
          className="rdp"
        />
        <div className="rounded-lg border border-gray-200 p-3 text-sm">
          <div className="font-medium">Your stay</div>
          {range?.from && range?.to ? (
            <>
              <div className="mt-1">{range.from.toLocaleDateString()} → {range.to.toLocaleDateString()}</div>
              <div className="mt-1">{selection.nights} night{selection.nights === 1 ? "" : "s"}</div>
              <div className="mt-2 text-base font-semibold">
                {selection.total != null ? `£${selection.total} total` : "Price unavailable"}
              </div>
            </>
          ) : (
            <div className="mt-1 text-gray-600">Select start and end date</div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .rdp-day[aria-disabled="true"] { opacity: 0.35; }
        .rdp { --rdp-accent-color: #0f172a; }
      `}</style>
    </div>
  );
}


