// apps/web/src/lib/slugify.ts
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")              // split accents
    .replace(/[\u0300-\u036f]/g, "")// remove diacritics
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")    // non-alphanumerics => hyphen
    .replace(/^-+|-+$/g, "")        // trim leading/trailing -
    .replace(/-{2,}/g, "-");        // collapse multiple -
}







