"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const manifestCache: { data: Record<string, string> | null } = { data: null };

function norm(input: string): string {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

export default function CardImage({ slug, alt, cover }: { slug: string; alt: string; cover?: string }) {
  const canonical = useMemo(() => `/photos/${norm(slug)}/1.jpg`, [slug]);
  const initial = cover || canonical;
  const [src, setSrc] = useState<string>(initial);
  const requested = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      // If a cover is provided, prefer it and skip manifest lookup
      if (cover) {
        setSrc(cover);
        return;
      }
      try {
        if (!manifestCache.data && !requested.current) {
          requested.current = true;
          const res = await fetch(`/photos/manifest.json`, { cache: "force-cache" });
          if (res.ok) {
            manifestCache.data = (await res.json()) as Record<string, string>;
          } else {
            manifestCache.data = {};
          }
        }
        const m = manifestCache.data || {};
        const key = norm(slug);
        let mapped = m[key];
        if (!mapped) {
          const hit = Object.entries(m).find(([k]) => k.includes(key) || key.includes(k));
          if (hit) mapped = hit[1];
        }
        if (!cancelled && mapped) setSrc(mapped);
      } catch {
        // keep canonical
      }
    }
    run();
    return () => { cancelled = true; };
  }, [slug, cover]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 relative">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
        priority={false}
        onError={() => {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn("Image failed:", src);
          }
        }}
      />
    </div>
  );
}


