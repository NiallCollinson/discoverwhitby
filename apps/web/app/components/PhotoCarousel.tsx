"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PhotoCarouselProps = {
  images: string[];
  alt: string;
};

export default function PhotoCarousel({ images, alt }: PhotoCarouselProps) {
  const sanitizedImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const pointerDeltaX = useRef<number>(0);

  const hasImages = sanitizedImages.length > 0;

  const goTo = useCallback((idx: number) => {
    if (!hasImages) return;
    const n = sanitizedImages.length;
    const next = ((idx % n) + n) % n;
    setCurrentIndex(next);
  }, [hasImages, sanitizedImages.length]);

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    pointerStartX.current = e.clientX;
    pointerDeltaX.current = 0;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current == null) return;
    pointerDeltaX.current = e.clientX - pointerStartX.current;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current == null) return;
    const dx = pointerDeltaX.current;
    const threshold = 50;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    pointerStartX.current = null;
    pointerDeltaX.current = 0;
    try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch {}
  }

  if (!hasImages) return null;

  return (
    <div className="w-full" aria-label="Photo carousel">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-lg bg-black"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="region"
        aria-roledescription="carousel"
        aria-live="polite"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sanitizedImages[currentIndex]}
          alt={alt}
          className="h-full w-full object-cover select-none"
          draggable={false}
        />
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-900 shadow hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-900 shadow hover:bg-white"
        >
          ›
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
          {currentIndex + 1} / {sanitizedImages.length}
        </div>
      </div>

      {sanitizedImages.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {sanitizedImages.slice(0, 12).map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`overflow-hidden rounded border ${i === currentIndex ? "ring-2 ring-black" : "border-transparent"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} ${i + 1}`} className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}





