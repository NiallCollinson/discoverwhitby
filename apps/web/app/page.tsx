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
              Start your search
            </a>
          </div>
        </div>
      </section>
      <PropertiesExplorer items={sample} hasDb={hasDb} />
    </main>
  );
}
