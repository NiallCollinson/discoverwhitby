import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const propertiesRouter = router({
  bySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(async ({ input }) => {
    // Placeholder; hook up to Prisma later
    return {
      id: "placeholder",
      slug: input.slug,
      title: "Sample Property",
      description: "Beautiful stay in Whitby",
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      latitude: 54.4863,
      longitude: -0.6133,
      priceNight: 150,
      amenities: ["WiFi", "Sea view"],
      images: [],
      reviews: [],
    };
  }),
});


