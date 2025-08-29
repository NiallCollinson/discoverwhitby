import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const searchRouter = router({
  listings: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        guests: z.number().int().positive().optional(),
        priceMin: z.number().int().nonnegative().optional(),
        priceMax: z.number().int().nonnegative().optional(),
        bbox: z
          .tuple([z.number(), z.number(), z.number(), z.number()])
          .optional(),
        sort: z.enum(["relevance", "price_asc", "price_desc"]).default("relevance"),
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      // Placeholder implementation; will be backed by Postgres
      return { items: [], nextCursor: null as string | null };
    }),
});


