import { fetchBeds24Properties } from "@discoverwhitby/integrations";

export default async function PropertyDetailsWidget({ slug, fallbackName, fallbackId }: { slug: string; fallbackName: string; fallbackId?: string }) {
  try {
    const list = await fetchBeds24Properties();
    const match = list.find((it: any) => String(it.id) === fallbackId || String(it.name ?? "").toLowerCase().replace(/\s+/g, "-") === fallbackName.toLowerCase().replace(/\s+/g, "-"));
    const name = String(match?.name ?? fallbackName);
    const bedrooms = Number(match?.bedrooms ?? "");
    const maxGuests = Number(match?.maxGuests ?? "");
    const description = String(match?.description ?? "");
    const city = match?.city;
    const postcode = match?.postcode;

    return (
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="text-lg font-semibold">About this property</div>
        <div className="mt-2 text-sm text-gray-800 whitespace-pre-line">{description || "No description available."}</div>
        <div className="mt-3 text-sm text-gray-700">{Number.isFinite(bedrooms) && bedrooms > 0 ? `${bedrooms} bedroom${bedrooms === 1 ? '' : 's'}` : null}{Number.isFinite(maxGuests) && maxGuests > 0 ? ` · Sleeps ${maxGuests}` : null}</div>
        {(city || postcode) ? (
          <div className="mt-1 text-sm text-gray-600">{[city, postcode].filter(Boolean).join(", ")}</div>
        ) : null}
      </div>
    );
  } catch {
    return null;
  }
}


