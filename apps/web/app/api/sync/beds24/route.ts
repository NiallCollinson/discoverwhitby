import { NextResponse } from "next/server";
import { createBeds24Adapter } from "@discoverwhitby/integrations";
import { prisma } from "@discoverwhitby/db";

export async function POST() {
  const adapter = createBeds24Adapter({
    apiKey: process.env.BEDS24_API_KEY,
    account: process.env.BEDS24_ACCOUNT,
  });

  const listings = await adapter.fetchListings();

  let upserted = 0;
  for (const l of listings) {
    await prisma.property.upsert({
      where: { slug: l.id },
      create: {
        slug: l.id,
        title: l.name,
        description: l.description ?? "",
        bedrooms: l.bedrooms ?? 1,
        bathrooms: l.bathrooms ?? 1,
        maxGuests: l.maxGuests ?? 2,
        latitude: l.latitude ?? 0,
        longitude: l.longitude ?? 0,
        priceNight: l.priceNight ?? 100,
        images: {
          create: (l.images ?? []).slice(0, 6).map((im) => ({ url: im.url, alt: im.alt ?? l.name, width: im.width ?? 1200, height: im.height ?? 800 })),
        },
      },
      update: {
        title: l.name,
        description: l.description ?? "",
        bedrooms: l.bedrooms ?? 1,
        bathrooms: l.bathrooms ?? 1,
        maxGuests: l.maxGuests ?? 2,
        latitude: l.latitude ?? 0,
        longitude: l.longitude ?? 0,
        priceNight: l.priceNight ?? 100,
        updatedAt: new Date(),
        images: {
          deleteMany: {},
          create: (l.images ?? []).slice(0, 6).map((im) => ({ url: im.url, alt: im.alt ?? l.name, width: im.width ?? 1200, height: im.height ?? 800 })),
        },
      },
    });
    // Map simple amenities
    const amenityNames: string[] = [];
    const tags = (l.tags ?? []).map((t) => t.toLowerCase());
    if (tags.includes("pet") || tags.includes("dog") || tags.includes("pet friendly")) amenityNames.push("Pet friendly");
    if (tags.includes("parking")) amenityNames.push("Parking");
    // Persist amenities
    for (const name of amenityNames) {
      const amenity = await prisma.amenity.upsert({ where: { name }, create: { name }, update: {} });
      await prisma.propertyAmenity.upsert({
        where: { propertyId_amenityId: { amenityId: amenity.id, propertyId: (await prisma.property.findUnique({ where: { slug: l.id }, select: { id: true } }))!.id } },
        create: { amenityId: amenity.id, propertyId: (await prisma.property.findUnique({ where: { slug: l.id }, select: { id: true } }))!.id },
        update: {},
      });
    }
    upserted += 1;
  }

  return NextResponse.json({ ok: true, count: upserted });
}


