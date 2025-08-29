import { createBeds24Adapter, fetchBeds24Properties } from "@discoverwhitby/integrations";
import { slugify } from "@/src/lib/slugify";
import { getLocalCover, getAllLocalPhotos3000 } from "@/src/server/photos/getLocalPhotos";
import { PropertiesExplorer } from "@/app/components/PropertiesExplorer";

export default async function PropertiesPage() {
  const hasDb = Boolean(process.env.DATABASE_URL);
  let properties: Array<{ id: string; slug: string; title: string; priceNight: number; bedrooms: number; maxGuests: number; coverImage?: string }> = [];

  if (!hasDb) {
    // Prefer Beds24 v2 full property list when available
    try {
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
      } else {
        // Fallback to legacy adapter demo list
        const adapter = createBeds24Adapter({ apiKey: process.env.BEDS24_API_KEY, account: process.env.BEDS24_ACCOUNT });
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
      const fallback = [
        { id: "demo-1", slug: "demo-1", title: "Harbour View Cottage", priceNight: 120, bedrooms: 2, maxGuests: 4 },
        { id: "demo-2", slug: "demo-2", title: "Abbey Loft Apartment", priceNight: 90, bedrooms: 1, maxGuests: 2 },
        { id: "demo-3", slug: "demo-3", title: "Sea Breeze House", priceNight: 180, bedrooms: 3, maxGuests: 6 },
      ];
      properties = await Promise.all(fallback.map(async (r) => ({ ...r, coverImage: await getLocalCover(r.slug) })));
    }
  } else {
    const { prisma } = await import("@discoverwhitby/db");
    const rows = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
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

  const globalPhotos = await getAllLocalPhotos3000();
  const hero = (globalPhotos.length ? globalPhotos[Math.floor(Math.random() * globalPhotos.length)] : undefined)
    || properties.find((p) => !!p.coverImage)?.coverImage
    || "/hero-whitby.mp4";

  // Randomize card covers from any 3000px photo
  if (globalPhotos.length) {
    const pick = () => globalPhotos[Math.floor(Math.random() * globalPhotos.length)];
    properties = properties.map((p) => ({ ...p, coverImage: pick() }));
  }

  return (
    <main className="min-h-screen">
      <section className="relative h-[40vh] w-full overflow-hidden sm:h-[50vh] lg:h-[60vh]">
        {hero.endsWith(".mp4") ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={hero} autoPlay muted loop playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="Explore properties" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-8">
          <a
            href="/properties"
            className="inline-flex items-center rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-black hover:bg-white"
          >
            Start your search
          </a>
        </div>
      </section>

      <PropertiesExplorer items={properties} hasDb={hasDb} />
    </main>
  );
}

