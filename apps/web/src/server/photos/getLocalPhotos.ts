import { promises as fs } from "node:fs";
import path from "node:path";

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function isValidExt(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return VALID_EXT.has(ext);
}

// Alphanumeric + numeric-aware sort
function alphaNumSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function listAllImageFilesRecursively(rootDir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string) {
    let entries: any[] = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(abs);
      } else if (e.isFile()) {
        if (isValidExt(e.name)) out.push(abs);
      }
    }
  }
  await walk(rootDir);
  return out;
}

/**
 * Returns public URLs like "/photos/<slug>/<file>"
 * Never throws; returns [] if directory missing or unreadable.
 */
export async function getLocalPhotos(slug: string): Promise<string[]> {
  try {
    const results: string[] = [];
    const foundFiles = new Set<string>();

    // 1) Scan app public folder (case-insensitive top-level folder fuzzy match, then recurse)
    try {
      const publicRoot = path.resolve(process.cwd(), "public", "photos");
      const entries = await fs.readdir(publicRoot, { withFileTypes: true });
      const folders = entries.filter((d) => d.isDirectory());
      let matchDir = folders.find((d) => d.name.toLowerCase() === slug.toLowerCase());
      if (!matchDir) {
        // Fuzzy: match by slugified directory name prefix/contains
        const slugLc = slug.toLowerCase();
        const scored = folders
          .map((d) => {
            const dirSlug = slugifySafe(d.name);
            const score = slugLc.startsWith(dirSlug) ? dirSlug.length : (dirSlug.startsWith(slugLc) ? slugLc.length : 0);
            return { d, dirSlug, score };
          })
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score);
        if (scored.length > 0) matchDir = scored[0].d;
      }
      if (matchDir) {
        const publicDir = path.join(publicRoot, matchDir.name);
        const all = await listAllImageFilesRecursively(publicDir);
        const rels = all
          .map((abs) => path.relative(publicRoot, abs))
          .sort(alphaNumSort);
        for (const rel of rels) {
          const url = `/photos/${rel.replace(/\\/g, "/")}`;
          const base = path.basename(rel);
          if (foundFiles.has(base)) continue;
          foundFiles.add(base);
          results.push(url);
        }
      }
    } catch {}

    return results;
  } catch {
    return [];
  }
}

function slugifySafe(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Convenience: the first photo or undefined
 */
export async function getLocalCover(slug: string) {
  const photos = await getLocalPhotos(slug);
  return photos[0];
}


