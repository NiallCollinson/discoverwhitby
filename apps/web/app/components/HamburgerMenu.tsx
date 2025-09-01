"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type RouteItem = { href: string; label: string };

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  // Static sitemap; extend as new routes are added
  const routes: RouteItem[] = useMemo(() => [
    { href: "/", label: "Home" },
    { href: "/properties", label: "All properties" },
    { href: "/demo", label: "Beds24 Widget Demo" },
    { href: "/property/bluegrass-cottage", label: "Bluegrass Cottage (example)" },
    { href: "/auth/sign-in", label: "Sign in" },
  ], []);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-black hover:bg-gray-50"
      >
        <span className="sr-only">Open menu</span>
        <div className="space-y-1">
          <span className="block h-0.5 w-5 bg-black" />
          <span className="block h-0.5 w-5 bg-black" />
          <span className="block h-0.5 w-5 bg-black" />
        </div>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg z-50">
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-semibold text-gray-500">Site map</div>
            <nav className="mt-1 grid">
              {routes.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="rounded px-2 py-2 text-sm hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  {r.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}


