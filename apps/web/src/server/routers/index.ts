import { router } from "../trpc";
import { searchRouter } from "./search";
import { propertiesRouter } from "./properties";
import { integrationsRouter } from "./integrations";

export const appRouter = router({
  search: searchRouter,
  properties: propertiesRouter,
  integrations: integrationsRouter,
});

export type AppRouter = typeof appRouter;


