"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

type DayInfo = { available: boolean; price: number | null; minStay: number | null };
type MonthData = Record<string, DayInfo>; // ISO -> info

export default function PriceCalendar({
  adults = Number(process.env.NEXT_PUBLIC_DEFAULT_ADULTS ?? 2),
  children = Number(process.env.NEXT_PUBLIC_DEFAULT_CHILDREN ?? 0),
}: { adults?: number; children?: number }) {
  const [visible, setVisible] = useState<{ year: number; month: number }>(() => {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
  });
  const [data, setData] = useState<Record<string, MonthData>>({});
  const [range, setRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const key = `${visible.year}-${visible.month}-${adults}-${children}`;
    if (data[key]) return;
    const url = `/api/beds24/month?year=${visible.year}&month=${visible.month}&adults=${adults}&children=${children}`;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        setData((prev) => ({ ...prev, [key]: (json?.days || {}) as MonthData }));
      })
      .catch(() => {});
  }, [visible, adults, children]);

  const dataKey = `${visible.year}-${visible.month}-${adults}-${children}`;

  const dayContent = (day: Date) => {
    const iso = day.toISOString().slice(0, 10);
    const info = data[dataKey]?.[iso];
    const priceStr = info?.price != null ? `£${Math.round(Number(info.price))}` : "";
    return (
      <div className="flex flex-col items-center">
        <div>{day.getDate()}</div>
        <div className="text-[10px] leading-tight opacity-80">{priceStr}</div>
      </div>
    );
  };

  const disabled = (day: Date) => {
    const iso = day.toISOString().slice(0, 10);
    const info = data[dataKey]?.[iso];
    return info ? !info.available : false;
  };

  useEffect(() => {
    if (range?.from && range?.to) {
      const nights = Math.round((range.to.getTime() - range.from.getTime()) / 86400000);
      if (nights <= 0) return;
      const params = new URLSearchParams({
        propid: String(process.env.NEXT_PUBLIC_BEDS24_PROP_ID ?? ""),
        checkin: range.from.toISOString().slice(0, 10),
        numnight: String(nights),
        numadult: String(adults),
        numchild: String(children),
        referer: String(process.env.NEXT_PUBLIC_BEDS24_REFERER ?? "discoverwhitby-home"),
        layout: String(process.env.NEXT_PUBLIC_BEDS24_LAYOUT ?? "2"),
      });
      const href = `https://beds24.com/booking2.php?${params.toString()}`;
      window.location.href = href;
    }
  }, [range, adults, children]);

  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        month={new Date(Date.UTC(visible.year, visible.month - 1, 1))}
        onMonthChange={(d) => setVisible({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 })}
        numberOfMonths={2}
        fixedWeeks
        showOutsideDays
        disabled={disabled}
        components={{ DayContent: (p) => dayContent(p.date) }}
        className="rdp"
      />
      <style jsx global>{`
        .rdp-day[aria-disabled="true"] { opacity: 0.35; }
        .rdp { --rdp-accent-color: #0ea5e9; }
      `}</style>
    </div>
  );
}


