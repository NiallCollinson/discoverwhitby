"use client";

import { useEffect, useRef } from "react";

type Point = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  href?: string;
};

function ensureLeafletLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    const w = window as any;
    if (w.L && document.querySelector('link[data-leaflet]')) {
      resolve();
      return;
    }
    // CSS
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      link.setAttribute("data-leaflet", "true");
      document.head.appendChild(link);
    }
    // JS
    const existing = document.querySelector('script[data-leaflet]') as HTMLScriptElement | null;
    if (existing && w.L) {
      resolve();
      return;
    }
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.async = true;
      (script as any).dataset.leaflet = "true";
      script.onload = () => resolve();
      document.body.appendChild(script);
    } else {
      existing.onload = () => resolve();
    }
  });
}

export default function LeafletMap({ points, height = 360 }: { points: Point[]; height?: number }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: any;
    let markers: any[] = [];
    let destroyed = false;
    (async () => {
      await ensureLeafletLoaded();
      if (destroyed || !mapRef.current) return;
      const L = (window as any).L;
      map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const valid = points.filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));
      if (valid.length === 0) {
        map.setView([54.4863, -0.6133], 12); // Whitby approx
        return;
      }
      const bounds = L.latLngBounds([]);
      valid.forEach((p) => {
        const m = L.marker([p.latitude, p.longitude]).addTo(map);
        const link = p.href ? `<div style=\"margin-top:6px\"><a href=\"${p.href}\" style=\"color:#2563eb\">View</a></div>` : "";
        m.bindPopup(`<strong>${p.name}</strong>${link}`);
        markers.push(m);
        bounds.extend([p.latitude, p.longitude]);
      });
      map.fitBounds(bounds.pad(0.2));
    })();

    return () => {
      destroyed = true;
      try {
        markers.forEach((m) => m.remove());
      } catch {}
      try {
        if (map) map.remove();
      } catch {}
    };
  }, [points]);

  return <div ref={mapRef} style={{ width: "100%", height }} />;
}







