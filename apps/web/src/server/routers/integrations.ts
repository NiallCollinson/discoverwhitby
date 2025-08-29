import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { createBeds24Adapter } from "@discoverwhitby/integrations";
import { prisma } from "@discoverwhitby/db";

export const integrationsRouter = router({
  beds24: router({
    syncListings: publicProcedure
      .input(z.object({}).optional())
      .mutation(async () => {
        const adapter = createBeds24Adapter({ apiKey: process.env.BEDS24_API_KEY, account: process.env.BEDS24_ACCOUNT });
        const listings = await adapter.fetchListings();
        for (const l of listings) {
          await prisma.property.upsert({
            where: { slug: l.id },
            create: {
              slug: l.id,
              title: l.name,
              description: l.description,
              bedrooms: l.bedrooms ?? 1,
              bathrooms: l.bathrooms ?? 1,
              maxGuests: l.maxGuests ?? 2,
              latitude: l.latitude ?? 0,
              longitude: l.longitude ?? 0,
              priceNight: l.priceNight ?? 100,
            },
            update: {
              title: l.name,
              description: l.description,
              bedrooms: l.bedrooms ?? 1,
              bathrooms: l.bathrooms ?? 1,
              maxGuests: l.maxGuests ?? 2,
              latitude: l.latitude ?? 0,
              longitude: l.longitude ?? 0,
              priceNight: l.priceNight ?? 100,
              updatedAt: new Date(),
            },
          });
        }
        return { count: listings.length };
      }),
  }),
});



