import { notFound } from "next/navigation";
import Image from "next/image";
import { createBeds24Adapter, fetchBeds24Properties } from "@discoverwhitby/integrations";
import { slugify } from "@/src/lib/slugify";
import { getLocalPhotos, getLocalCover, getAllLocalPhotos3000 } from "@/src/server/photos/getLocalPhotos";
import { getProperties as bedsGetProperties, getProperty as bedsGetProperty, getInventory as bedsGetInventory } from "@/src/server/beds24Json";
import PhotoCarousel from "@/app/components/PhotoCarousel";
import AvailabilityWidget from "@/src/components/AvailabilityWidget";
import PropertyDetailsWidget from "@/src/components/PropertyDetailsWidget";
import PropertyAvailabilityCalendar from "@/src/components/PropertyAvailabilityCalendar";
import { PropertiesExplorer } from "@/app/components/PropertiesExplorer";

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const FILLER = "/photos/5%20Starfish/Full%20Res/5Starfish_FullRes-1.jpg";
  const slug = params.slug;
  const hasDb = Boolean(process.env.DATABASE_URL);
  
  // Fetch properties for the PropertiesExplorer component
  let allProperties: Array<{ id: string; slug: string; title: string; priceNight: number; bedrooms: number; maxGuests: number; coverImage?: string }> = [];
  if (!hasDb) {
    const adapter = createBeds24Adapter({ apiKey: process.env.BEDS24_API_KEY, account: process.env.BEDS24_ACCOUNT });
    try {
      const live = await fetchBeds24Properties();
      if (live && live.length) {
        allProperties = await Promise.all(live.map(async (p: any) => {
          const propSlug = slugify(String(p.name ?? ""));
          const local = await getLocalCover(propSlug);
          return {
            id: String(p.id),
            slug: propSlug,
            title: String(p.name ?? "Untitled"),
            priceNight: p.priceNight ?? 100,
            bedrooms: p.bedrooms ?? 1,
            maxGuests: p.maxGuests ?? 2,
            coverImage: local ?? (p.images?.[0]?.url as string | undefined),
          };
        }));
      }
      if (!allProperties || allProperties.length === 0) {
        const listings = await adapter.fetchListings();
        allProperties = await Promise.all(listings.map(async (l) => {
          const propSlug = slugify(l.name);
          const local = await getLocalCover(propSlug);
          return {
            id: l.id,
            slug: propSlug,
            title: l.name,
            priceNight: l.priceNight ?? 100,
            bedrooms: l.bedrooms ?? 1,
            maxGuests: l.maxGuests ?? 2,
            coverImage: local ?? l.images[0]?.url,
          };
        }));
      }
    } catch {
      allProperties = await Promise.all([
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
    allProperties = await Promise.all(rows.map(async (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      priceNight: r.priceNight,
      bedrooms: r.bedrooms,
      maxGuests: r.maxGuests,
      coverImage: (await getLocalCover(r.slug)) ?? (r as any).images?.[0]?.url,
    })));
  }
  
  // Randomize cover images and sample a subset for the explorer
  try {
    const globalPhotos = await getAllLocalPhotos3000();
    if (globalPhotos.length) {
      const pick = () => globalPhotos[Math.floor(Math.random() * globalPhotos.length)];
      allProperties = allProperties.map((p) => ({ ...p, coverImage: pick() }));
    }
  } catch {}
  const sampleProperties = allProperties.slice().sort(() => Math.random() - 0.5).slice(0, 6);
  if (!hasDb) {
    const adapter = createBeds24Adapter({ apiKey: process.env.BEDS24_API_KEY, account: process.env.BEDS24_ACCOUNT });
    const listings = await adapter.fetchListings();
    let p = listings.find((l) => l.id === slug || slugify(l.name) === slug);
    if (!p) {
      // Fallback to token-based v2 properties fetch (when configured)
      const props = await fetchBeds24Properties();
      const match = props.find((it: any) => String(it.id) === slug || slugify(String(it.name ?? "")) === slug);
      if (match) {
        p = {
          id: String(match.id),
          name: String(match.name ?? "Untitled"),
          description: match.description ?? "",
          latitude: match.latitude,
          longitude: match.longitude,
          bedrooms: match.bedrooms ?? 1,
          bathrooms: 1,
          maxGuests: match.maxGuests ?? 2,
          priceNight: match.priceNight ?? 100,
          tags: [],
          images: (match.images ?? []).map((im: any) => ({ url: im.url, alt: im.alt })),
        } as any;
      }
    }
    if (!p) {
      const hero = FILLER;
      const gallery = [FILLER, FILLER, FILLER];
      const titleGuess = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      return (
        <>
          <div className="relative h-96 w-full">
            <Image src={hero} alt={titleGuess} fill priority sizes="100vw" className="object-cover" />
          </div>
          <div className="mx-auto max-w-5xl px-6 py-12">
            <PhotoCarousel images={[hero, ...gallery]} alt={titleGuess} />
          </div>
        </>
      );
    }
    const hero = FILLER;
    const gallery = [FILLER, FILLER, FILLER];

    // Try to enrich details via Beds24 JSON (non-fatal if fails)
    try {
      const all = await bedsGetProperties();
      const found = all.find((it: any) => String(it.id) === String(p.id) || slugify(String(it.name ?? "")) === slugify(p.name));
      if (found?.id) {
        const details = await bedsGetProperty(found.id);
        const inventory = await bedsGetInventory(found.id);
        if (details?.description && !p.description) p.description = String(details.description);
        if (typeof details?.bedrooms === "number") p.bedrooms = Number(details.bedrooms);
        if (typeof details?.maxGuests === "number") p.maxGuests = Number(details.maxGuests);
        // inventory can be wired to availability widgets later
      }
    } catch {}

    // If this property exists in Beds24 v2 data, extract room/roomType/unit images and names
    let roomGroups: Array<{ name: string; images: string[] }> = [];
    try {
      const all = await fetchBeds24Properties();
      const match = all.find((it: any) => String(it.id) === String(p.id) || slugify(String(it.name ?? "")) === slugify(p.name));
      if (match && (match as any).raw) {
        const raw = (match as any).raw as any;
        const containers = [
          ...(Array.isArray(raw?.rooms) ? raw.rooms : raw?.rooms ? [raw.rooms] : []),
          ...(Array.isArray(raw?.roomTypes) ? raw.roomTypes : raw?.roomTypes ? [raw.roomTypes] : []),
          ...(Array.isArray(raw?.roomtypes) ? raw.roomtypes : raw?.roomtypes ? [raw.roomtypes] : []),
          ...(Array.isArray(raw?.units) ? raw.units : raw?.units ? [raw.units] : []),
        ];
        const groups: Array<{ name: string; images: string[] }> = [];
        for (const c of containers) {
          if (!c) continue;
          const name = String(c?.name ?? c?.title ?? c?.roomName ?? c?.type ?? "Room");
          const imgsRaw = ([] as any[])
            .concat(c?.images ?? [], c?.pictures ?? [], c?.photos ?? [])
            .concat(typeof c?.image === "string" ? [{ url: c.image }] : [])
            .concat(typeof c?.coverImage === "string" ? [{ url: c.coverImage }] : []);
          const imgs = imgsRaw.map((im: any) => String(im?.url ?? im?.src ?? im?.href ?? im ?? "")).filter((u: string) => u);
          if (imgs.length) groups.push({ name, images: Array.from(new Set(imgs)) });
        }
        roomGroups = groups;
      }
    } catch {}

    return (
      <>
        <div className="relative h-96 w-full">
          {hero ? (
            <Image src={hero} alt={p.name} fill priority sizes="100vw" className="object-cover" />
          ) : null}
        </div>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <PhotoCarousel images={[hero, ...gallery].filter(Boolean)} alt={p.name} />
          <div className="mt-6 text-2xl font-semibold">{p.name}</div>
          <div className="mt-2 text-gray-700">Sleeps {p.maxGuests} · {p.bedrooms} bed · {p.bathrooms} bath</div>
          <div className="mt-4">£{p.priceNight}/night</div>

          {/* Availability calendar */}
          <PropertyAvailabilityCalendar propertyId={slug === "bluegrass-cottage" ? "215637" : String(p.id ?? "132982")} />

          

          {slug === "bluegrass-cottage" ? (
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
              <div className="mt-2 text-sm text-gray-800">
                Bluegrass Cottage is a delightful, centrally located one bedroom cottage in Whitby with its
                own private parking space. It has a separate bedroom, living and dining space as well as a fully
                equipped kitchen. Located on Hunter Street.
              </div>
              <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                <div>Sleeps: 2</div>
                <div>Bedrooms: 1 (1 x Double)</div>
                <div>Bathrooms: 1 (Shower)</div>
                <div>Dogs: Allowed (fee)</div>
                <div>Parking: Private space</div>
                <div className="sm:col-span-2 text-xs text-gray-600">Parking in North Yorkshire is free to Blue Badge holders.</div>
                <div className="sm:col-span-2 text-xs text-gray-600">Scratch cards: enables parking all day with a correctly validated scratch card on display in their vehicle until 10am the following day.</div>
                <div className="sm:col-span-2 text-xs text-gray-600">Whitby Laundry sells a 2 day parking permit and guide.</div>
                
              </div>
              
            </div>
          ) : null}

          {roomGroups.length > 0 ? (
            <div className="mt-10">
              <div className="text-xl font-semibold">Rooms and units</div>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {roomGroups.map((g, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 p-3">
                    <div className="text-sm font-medium">{g.name}</div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {g.images.slice(0, 6).map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={src} alt={`${g.name} ${i + 1}`} className="aspect-square w-full rounded object-cover" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Properties Explorer with search functionality */}
        <PropertiesExplorer items={sampleProperties} hasDb={hasDb} />
      </>
    );
  }
  try {
    const { prisma } = await import("@discoverwhitby/db");
    const p = await prisma.property.findUnique({ where: { slug }, include: { images: true, amenities: { include: { amenity: true } } } });
    if (!p) return notFound();
    const hero = FILLER;
    const gallery = [FILLER, FILLER, FILLER];
    return (
      <>
        <div className="relative h-96 w-full">
          {hero ? (
            <Image src={hero} alt={p.title} fill priority sizes="100vw" className="object-cover" />
          ) : null}
        </div>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <PhotoCarousel images={[hero, ...gallery].filter(Boolean)} alt={p.title} />
          <div className="mt-6 text-2xl font-semibold">{p.title}</div>
          <div className="mt-2 text-gray-700">Sleeps {p.maxGuests} · {p.bedrooms} bed · {p.bathrooms} bath</div>
          <div className="mt-4">£{p.priceNight}/night</div>

          {/* Availability calendar */}
          <PropertyAvailabilityCalendar propertyId={slug === "bluegrass-cottage" ? "215637" : String(p.id ?? "132982")} />

          
        </div>
        
        {/* Properties Explorer with search functionality */}
        <PropertiesExplorer items={sampleProperties} hasDb={hasDb} />
      </>
    );
  } catch {
    // DB unreachable: render with local photos only
    const hero = FILLER;
    const gallery = [FILLER, FILLER, FILLER];
    const titleGuess = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <>
        <div className="relative h-96 w-full">
          <Image src={hero} alt={titleGuess} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <PhotoCarousel images={[hero, ...gallery]} alt={titleGuess} />
          <div className="mt-6 text-2xl font-semibold">{titleGuess}</div>
        </div>
        
        {/* Properties Explorer with search functionality */}
        <PropertiesExplorer items={sampleProperties} hasDb={hasDb} />
      </>
    );
  }
}


