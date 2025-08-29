import { z } from "zod";

export const Beds24Listing = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(""),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bedrooms: z.number().int().optional().default(1),
  bathrooms: z.number().int().optional().default(1),
  maxGuests: z.number().int().optional().default(2),
  priceNight: z.number().int().optional().default(100),
  tags: z.array(z.string()).optional().default([]),
  images: z
    .array(
      z.object({
        url: z.string(),
        width: z.number().int().optional(),
        height: z.number().int().optional(),
        alt: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export type Beds24Listing = z.infer<typeof Beds24Listing>;

export type Beds24Adapter = {
  fetchListings: () => Promise<Beds24Listing[]>;
  fetchRatesAvailability: (opts: { listingId: string; checkIn: string; checkOut: string }) => Promise<any>;
  pushBooking: (opts: { listingId: string; payload: any }) => Promise<{ ok: boolean; id?: string }>;
  webhookHandler: (payload: any) => Promise<void>;
  normalizeListing: (raw: any) => Beds24Listing;
};

export function createBeds24Adapter(opts: { apiKey?: string; account?: string; baseUrl?: string }): Beds24Adapter {
  const fetcher = async (path: string, body: any) => {
    // Safe placeholder: real integration should call Beds24 REST/JSON API
    if (!opts.apiKey || !opts.account) return { items: [] } as any;
    try {
      const url = (opts.baseUrl ?? "https://api.beds24.com/v2") + path;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          // NOTE: Update these headers once we confirm Beds24 auth format
          "x-api-key": opts.apiKey,
          "x-account": String(opts.account),
        },
        body: JSON.stringify(body ?? {}),
      });
      if (!res.ok) return { items: [] } as any;
      return res.json();
    } catch {
      return { items: [] } as any;
    }
  };

  return {
    async fetchListings() {
      if (!opts.apiKey || !opts.account) {
        // Mock 3 listings when not configured
        return [
          { id: "demo-1", name: "Harbour View Cottage", latitude: 54.4863, longitude: -0.6133, bedrooms: 2, bathrooms: 1, maxGuests: 4, priceNight: 120, tags: ["parking", "cottage"], images: [{ url: "/hero-whitby.mp4", alt: "Harbour view" }] },
          { id: "demo-2", name: "Abbey Loft Apartment", latitude: 54.487, longitude: -0.615, bedrooms: 1, bathrooms: 1, maxGuests: 2, priceNight: 90, tags: ["apartment"], images: [] },
          { id: "demo-3", name: "Sea Breeze House", latitude: 54.485, longitude: -0.61, bedrooms: 3, bathrooms: 2, maxGuests: 6, priceNight: 180, tags: ["large house", "pet"], images: [] },
        ];
      }
      try {
        const res = await fetcher("/listings", {});
        const items = (res.items as any[]).map((i) => this.normalizeListing(i));
        if (items.length === 0) {
          // Fallback to mock if API returned nothing/unauthorized
          return [
            { id: "demo-1", name: "Harbour View Cottage", latitude: 54.4863, longitude: -0.6133, bedrooms: 2, bathrooms: 1, maxGuests: 4, priceNight: 120, tags: ["parking", "cottage"], images: [{ url: "/hero-whitby.mp4", alt: "Harbour view" }] },
            { id: "demo-2", name: "Abbey Loft Apartment", latitude: 54.487, longitude: -0.615, bedrooms: 1, bathrooms: 1, maxGuests: 2, priceNight: 90, tags: ["apartment"], images: [] },
            { id: "demo-3", name: "Sea Breeze House", latitude: 54.485, longitude: -0.61, bedrooms: 3, bathrooms: 2, maxGuests: 6, priceNight: 180, tags: ["large house", "pet"], images: [] },
          ];
        }
        return items;
      } catch {
        return [
          { id: "demo-1", name: "Harbour View Cottage", latitude: 54.4863, longitude: -0.6133, bedrooms: 2, bathrooms: 1, maxGuests: 4, priceNight: 120, tags: ["parking", "cottage"], images: [{ url: "/hero-whitby.mp4", alt: "Harbour view" }] },
          { id: "demo-2", name: "Abbey Loft Apartment", latitude: 54.487, longitude: -0.615, bedrooms: 1, bathrooms: 1, maxGuests: 2, priceNight: 90, tags: ["apartment"], images: [] },
          { id: "demo-3", name: "Sea Breeze House", latitude: 54.485, longitude: -0.61, bedrooms: 3, bathrooms: 2, maxGuests: 6, priceNight: 180, tags: ["large house", "pet"], images: [] },
        ];
      }
    },
    async fetchRatesAvailability(_opts) {
      return {};
    },
    async pushBooking(_opts) {
      return { ok: true, id: "mock" };
    },
    async webhookHandler(_payload) {
      return;
    },
    normalizeListing(raw: any) {
      return Beds24Listing.parse({
        id: String(raw.id ?? raw.propertyId ?? raw.uid ?? "unknown"),
        name: String(raw.name ?? raw.title ?? "Untitled"),
        description: raw.description ?? "",
        latitude: Number(raw.latitude ?? raw.lat ?? 0) || undefined,
        longitude: Number(raw.longitude ?? raw.lng ?? 0) || undefined,
        bedrooms: Number(raw.bedrooms ?? 1),
        bathrooms: Number(raw.bathrooms ?? 1),
        maxGuests: Number(raw.maxGuests ?? 2),
        priceNight: Number(raw.priceNight ?? raw.price ?? 100),
        tags: Array.isArray(raw.tags) ? raw.tags.map((t: any) => String(t).toLowerCase()) : [],
        images: Array.isArray(raw.images)
          ? raw.images
              .map((im: any) => ({ url: String(im.url ?? im.href ?? ""), width: im.width ? Number(im.width) : undefined, height: im.height ? Number(im.height) : undefined, alt: im.alt ? String(im.alt) : undefined }))
              .filter((im: any) => im.url)
          : [],
      });
    },
  };
}


// ---- Beds24 v2 (token header) lightweight fetch for properties ----------------
export type Beds24V2Property = {
  id: string | number;
  name: string;
  description?: string;
  bedrooms?: number;
  maxGuests?: number;
  priceNight?: number;
  images?: Array<{ url: string; alt?: string; width?: number; height?: number }>;
  latitude?: number;
  longitude?: number;
  addressLine1?: string;
  city?: string;
  country?: string;
  postcode?: string;
  raw?: unknown;
};

function getEnvOrUndefined(name: string): string | undefined {
  const v = process.env[name];
  return v && String(v).length > 0 ? String(v) : undefined;
}

function asArr<T = any>(v: any): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export async function fetchBeds24Properties(): Promise<Beds24V2Property[]> {
  const baseUrl = getEnvOrUndefined("BEDS24_BASE_URL") ?? "https://beds24.com/api/v2";
  const account = getEnvOrUndefined("BEDS24_ACCOUNT");
  const token = getEnvOrUndefined("BEDS24_ACCESS_TOKEN");
  if (!token || !account) return [];

  const url = new URL(baseUrl.replace(/\/$/, "") + "/properties");
  url.searchParams.set("accountId", account);
  url.searchParams.set("account", account);
  url.searchParams.set("includeAllRooms", "true");
  url.searchParams.set("include", "images,tags,address,location,rooms,roomTypes,roomtypes,units");

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json", token },
      // No body on GET
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: any[] = Array.isArray(data)
      ? data
      : (data?.items ?? data?.data ?? data?.properties ?? data?.result ?? []);
    return list.map((raw: any) => {
      const propImages: any[] = Array.isArray(raw?.images) ? raw.images : Array.isArray(raw?.pictures) ? raw.pictures : [];
      const mappedImages = propImages
        .map((im: any) => ({ url: String(im?.url ?? im?.src ?? im?.href ?? ""), alt: im?.alt ?? im?.title, width: im?.width ? Number(im.width) : undefined, height: im?.height ? Number(im.height) : undefined }))
        .filter((im: any) => im.url);

      // Collect images from rooms/room types/units as fallback or enrichment
      const roomContainers = [
        ...asArr(raw?.rooms),
        ...asArr(raw?.roomTypes),
        ...asArr(raw?.roomtypes),
        ...asArr(raw?.units),
      ];
      const roomImagesRaw: any[] = [];
      for (const r of roomContainers) {
        if (!r) continue;
        roomImagesRaw.push(...asArr(r?.images), ...asArr(r?.pictures), ...asArr(r?.photos));
        if (typeof r?.image === "string") roomImagesRaw.push({ url: r.image });
        if (typeof r?.coverImage === "string") roomImagesRaw.push({ url: r.coverImage });
      }
      const mappedRoomImages = roomImagesRaw
        .map((im: any) => ({ url: String(im?.url ?? im?.src ?? im?.href ?? im ?? ""), alt: im?.alt ?? im?.title, width: im?.width ? Number(im.width) : undefined, height: im?.height ? Number(im.height) : undefined }))
        .filter((im: any) => im.url);
      const combinedUrls = new Set<string>();
      const combinedImages = [...mappedImages, ...mappedRoomImages].filter((im) => {
        if (combinedUrls.has(im.url)) return false;
        combinedUrls.add(im.url);
        return true;
      });
      const lat = raw?.latitude ?? raw?.lat ?? raw?.location?.lat ?? raw?.geo?.lat;
      const lng = raw?.longitude ?? raw?.lng ?? raw?.location?.lng ?? raw?.location?.lon ?? raw?.geo?.lng ?? raw?.geo?.lon;
      const address = raw?.address ?? {};
      const line1 = address?.line1 ?? address?.address1 ?? raw?.street ?? raw?.address1 ?? undefined;
      const city = raw?.city ?? raw?.town ?? address?.city ?? address?.town ?? undefined;
      const country = raw?.country ?? address?.country ?? address?.countryCode ?? undefined;
      const postcode = raw?.postcode ?? raw?.zip ?? address?.postcode ?? address?.zip ?? undefined;
      return {
        id: String(raw?.id ?? raw?.propertyId ?? raw?.uid ?? ""),
        name: String(raw?.name ?? raw?.title ?? "Untitled"),
        description: raw?.description ?? "",
        bedrooms: raw?.bedrooms ? Number(raw.bedrooms) : undefined,
        maxGuests: raw?.maxGuests ? Number(raw.maxGuests) : undefined,
        priceNight: raw?.basePrice ? Number(raw.basePrice) : raw?.price ? Number(raw.price) : undefined,
        images: combinedImages,
        latitude: typeof lat === "number" ? lat : (typeof lat === "string" ? parseFloat(lat) : undefined),
        longitude: typeof lng === "number" ? lng : (typeof lng === "string" ? parseFloat(lng) : undefined),
        addressLine1: line1 ? String(line1) : undefined,
        city: city ? String(city) : undefined,
        country: country ? String(country) : undefined,
        postcode: postcode ? String(postcode) : undefined,
        raw,
      } as Beds24V2Property;
    });
  } catch {
    return [];
  }
}



