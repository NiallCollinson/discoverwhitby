import { redirect } from "next/navigation";
import { slugify } from "@/src/lib/slugify";
import { createBeds24Adapter, fetchBeds24Properties } from "@discoverwhitby/integrations";

export default async function PropertiesIdPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const hasDb = Boolean(process.env.DATABASE_URL);

  if (hasDb) {
    const { prisma } = await import("@discoverwhitby/db");
    const p = await prisma.property.findFirst({ where: { OR: [{ id }, { slug: id }] }, select: { slug: true } });
    if (p?.slug) return redirect(`/property/${p.slug}`);
    return redirect("/");
  }

  const adapter = createBeds24Adapter({ apiKey: process.env.BEDS24_API_KEY, account: process.env.BEDS24_ACCOUNT });
  const listings = await adapter.fetchListings();
  let listing = listings.find((l) => l.id === id || slugify(l.name) === id);
  if (!listing) {
    const props = await fetchBeds24Properties();
    const match = props.find((it: any) => String(it.id) === id || slugify(String(it.name ?? "")) === id);
    if (match) {
      const slug = slugify(String(match.name ?? ""));
      return redirect(`/property/${slug}`);
    }
  } else {
    const slug = slugify(listing.name);
    return redirect(`/property/${slug}`);
  }
  return redirect("/");
}


