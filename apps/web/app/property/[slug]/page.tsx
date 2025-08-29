import { notFound } from "next/navigation";
import Image from "next/image";
import { createBeds24Adapter, fetchBeds24Properties } from "@discoverwhitby/integrations";
import { slugify } from "@/src/lib/slugify";
import { getLocalPhotos, getLocalCover, getAllLocalPhotos3000 } from "@/src/server/photos/getLocalPhotos";
import PhotoCarousel from "@/app/components/PhotoCarousel";

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const hasDb = Boolean(process.env.DATABASE_URL);
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
      // Last-resort: render page with local photos only (from any 3000px folder)
      const localPhotos = await getAllLocalPhotos3000();
      const hero = localPhotos.length ? localPhotos[Math.floor(Math.random() * localPhotos.length)] : undefined;
      const gallery = localPhotos.filter((u) => u !== hero);
      if (!hero) return notFound();
      const titleGuess = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      return (
        <>
          <div className="relative h-96 w-full">
            <Image src={hero} alt={titleGuess} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="px-4 text-center text-3xl font-bold text-white drop-shadow-md">{titleGuess}</h1>
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-6 py-12">
            <PhotoCarousel images={[hero, ...gallery]} alt={titleGuess} />
          </div>
        </>
      );
    }
    const [globalPhotos, photos] = await Promise.all([
      getAllLocalPhotos3000(),
      getLocalPhotos(slugify(p.name)),
    ]);
    const remoteHero = (p.images && p.images[0]?.url) || undefined;
    const hero = (globalPhotos.length ? globalPhotos[Math.floor(Math.random() * globalPhotos.length)] : undefined) ?? remoteHero;
    const gallery = globalPhotos.filter((u) => u !== hero);

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
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="px-4 text-center text-3xl font-bold text-white drop-shadow-md">{p.name}</h1>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <PhotoCarousel images={[hero, ...gallery].filter(Boolean)} alt={p.name} />
          <div className="mt-6 text-2xl font-semibold">{p.name}</div>
          <div className="mt-2 text-gray-700">Sleeps {p.maxGuests} · {p.bedrooms} bed · {p.bathrooms} bath</div>
          <div className="mt-4">£{p.priceNight}/night</div>
          <p className="mt-6 whitespace-pre-line text-gray-800">{p.description || ""}</p>

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
      </>
    );
  }
  try {
    const { prisma } = await import("@discoverwhitby/db");
    const p = await prisma.property.findUnique({ where: { slug }, include: { images: true, amenities: { include: { amenity: true } } } });
    if (!p) return notFound();
    const photoSlug = (p as any).slug || slugify(p.title);
    const localPhotos = await getLocalPhotos(photoSlug);
    const globalPhotos = await getAllLocalPhotos3000();
    const remoteHero = (p.images && (p as any).images?.[0]?.url) || undefined;
    const hero = (globalPhotos.length ? globalPhotos[Math.floor(Math.random() * globalPhotos.length)] : undefined) ?? remoteHero;
    const gallery = globalPhotos.filter((u) => u !== hero);
    return (
      <>
        <div className="relative h-96 w-full">
          {hero ? (
            <Image src={hero} alt={p.title} fill priority sizes="100vw" className="object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="px-4 text-center text-3xl font-bold text-white drop-shadow-md">{p.title}</h1>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <PhotoCarousel images={[hero, ...gallery].filter(Boolean)} alt={p.title} />
          <div className="mt-6 text-2xl font-semibold">{p.title}</div>
          <div className="mt-2 text-gray-700">Sleeps {p.maxGuests} · {p.bedrooms} bed · {p.bathrooms} bath</div>
          <div className="mt-4">£{p.priceNight}/night</div>
          <p className="mt-6 whitespace-pre-line text-gray-800">{p.description}</p>
        </div>
      </>
    );
  } catch {
    // DB unreachable: render with local photos only
    const photos = await getLocalPhotos(slug);
    const globalPhotos = await getAllLocalPhotos3000();
    const hero = globalPhotos.length ? globalPhotos[Math.floor(Math.random() * globalPhotos.length)] : undefined;
    if (!hero) return notFound();
    const gallery = globalPhotos.filter((u) => u !== hero);
    const titleGuess = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <>
        <div className="relative h-96 w-full">
          <Image src={hero} alt={titleGuess} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="px-4 text-center text-3xl font-bold text-white drop-shadow-md">{titleGuess}</h1>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <PhotoCarousel images={[hero, ...gallery]} alt={titleGuess} />
          <div className="mt-6 text-2xl font-semibold">{titleGuess}</div>
        </div>
      </>
    );
  }
}


