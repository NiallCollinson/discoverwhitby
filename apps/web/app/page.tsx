import { createBeds24Adapter, fetchBeds24Properties } from "@discoverwhitby/integrations";
import { slugify } from "@/src/lib/slugify";
import { getLocalCover, getAllLocalPhotos3000 } from "@/src/server/photos/getLocalPhotos";
import { PropertiesExplorer } from "./components/PropertiesExplorer";

export default async function Home() {
  const heroVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero-whitby.mp4";
  const hasDb = Boolean(process.env.DATABASE_URL);
  let properties: Array<{ id: string; slug: string; title: string; priceNight: number; bedrooms: number; maxGuests: number; coverImage?: string }> = [];
  if (!hasDb) {
    const adapter = createBeds24Adapter({ apiKey: process.env.BEDS24_API_KEY, account: process.env.BEDS24_ACCOUNT });
    try {
      // Try the richer v2 properties list (same source as /properties page)
      const live = await fetchBeds24Properties();
      if (live && live.length) {
        properties = await Promise.all(live.map(async (p: any) => {
          const slug = slugify(String(p.name ?? ""));
          const local = await getLocalCover(slug);
          return {
            id: String(p.id),
            slug,
            title: String(p.name ?? "Untitled"),
            priceNight: p.priceNight ?? 100,
            bedrooms: p.bedrooms ?? 1,
            maxGuests: p.maxGuests ?? 2,
            coverImage: local ?? (p.images?.[0]?.url as string | undefined),
          };
        }));
      }
      // Fallback to adapter listings if needed
      if (!properties || properties.length === 0) {
        const listings = await adapter.fetchListings();
        properties = await Promise.all(listings.map(async (l) => {
          const slug = slugify(l.name);
          const local = await getLocalCover(slug);
          return {
            id: l.id,
            slug,
            title: l.name,
            priceNight: l.priceNight ?? 100,
            bedrooms: l.bedrooms ?? 1,
            maxGuests: l.maxGuests ?? 2,
            coverImage: local ?? l.images[0]?.url,
          };
        }));
      }
    } catch {
      // Last-resort demo data
      properties = await Promise.all([
        { id: "demo-1", slug: "demo-1", title: "Harbour View Cottage", priceNight: 120, bedrooms: 2, maxGuests: 4 },
        { id: "demo-2", slug: "demo-2", title: "Abbey Loft Apartment", priceNight: 90, bedrooms: 1, maxGuests: 2 },
        { id: "demo-3", slug: "demo-3", title: "Sea Breeze House", priceNight: 180, bedrooms: 3, maxGuests: 6 },
      ].map(async (r) => ({ ...r, coverImage: await getLocalCover(r.slug) })));
    }
  } else {
    const { prisma } = await import("@discoverwhitby/db");
    const rows = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, slug: true, title: true, priceNight: true, bedrooms: true, maxGuests: true, images: { select: { url: true } } },
    });
    properties = await Promise.all(rows.map(async (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      priceNight: r.priceNight,
      bedrooms: r.bedrooms,
      maxGuests: r.maxGuests,
      coverImage: (await getLocalCover(r.slug)) ?? (r as any).images?.[0]?.url,
    })));
  }
  // Randomize cover images similar to /properties page and sample a subset for the homepage
  try {
    const globalPhotos = await getAllLocalPhotos3000();
    if (globalPhotos.length) {
      const pick = () => globalPhotos[Math.floor(Math.random() * globalPhotos.length)];
      properties = properties.map((p) => ({ ...p, coverImage: pick() }));
    }
  } catch {}
  const sample = properties.slice().sort(() => Math.random() - 0.5).slice(0, 6);

  return (
    <main className="min-h-screen">
      <section className="relative h-[60vh] w-full overflow-hidden sm:h-[70vh] lg:h-[80vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <div>
            <h1 className="text-3xl font-semibold text-black sm:text-4xl lg:text-5xl">Discover Whitby</h1>
            <p className="mt-3 max-w-2xl text-black/80">Get away for less, cottages and more starting at £50 a night!</p>
            <a href="/properties" className="mt-6 inline-flex rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-black hover:bg-white">
              Properties
            </a>
          </div>
        </div>
      </section>
      
      {/* Beds24 Booking Widget */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Book Your Stay</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Check availability and book your Whitby accommodation directly through our secure booking system.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 overflow-hidden">
              <iframe 
                src="https://beds24.com/booking2.php?ownerid=73864&numadult=2&advancedays=0&referer=iframe" 
                width="2000" 
                height="2000" 
                style={{maxWidth: '100%', border: 'none', overflow: 'auto'}}
                title="Beds24 Booking Widget"
                frameBorder="0"
                allowFullScreen
                className="w-full border-0"
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Having trouble with the widget? <a href="https://beds24.com/booking2.php?ownerid=73864&referer=iframe" className="text-blue-600 hover:text-blue-800 underline">Book directly here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Promotional Sections */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Why Choose Whitby?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the charm and beauty of our coastal town</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
              <span aria-hidden="true">🐾</span>
              <span>PET FRIENDLY</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
              <span aria-hidden="true">🅿️</span>
              <span>PARKING</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
              <span aria-hidden="true">💷</span>
              <span>FANTASTIC VALUE</span>
            </div>
          </div>
          
          <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6 text-center">
            <div className="text-lg font-semibold">The longer the stay, the bigger the discount</div>
            <div className="mt-2 text-sm text-gray-600">Save more when you book 7+ nights.</div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Free parking</div>
              <p className="mt-1 text-gray-600">Stays with on-site parking included.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Large houses</div>
              <p className="mt-1 text-gray-600">Space for the whole group.</p>
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
      </section>
    </main>
  );
}
