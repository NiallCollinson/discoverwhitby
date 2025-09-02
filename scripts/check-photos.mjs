#!/usr/bin/env node
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

async function readPropertiesFromWeb() {
  // Load the derived property list similar to app/page.tsx (no DB): from Beds24 adapter
  // We read the built JS is not available here; instead scan /public/photos for directories as the source of truth
  const photosRoot = path.resolve(process.cwd(), "apps/web/public/photos");
  const items = [];
  try {
    const dirs = await fs.readdir(photosRoot, { withFileTypes: true });
    for (const d of dirs) {
      if (d.isDirectory()) items.push({ slug: d.name, title: d.name.replace(/-/g, " ") });
    }
  } catch {}
  return items;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(abs);
    else yield abs;
  }
}

async function findClosestMatches(photosRoot, slug) {
  const targetFile = "1.jpg";
  const candidates = [];
  try {
    for await (const file of walk(photosRoot)) {
      const rel = path.relative(photosRoot, file).replace(/\\/g, "/");
      const [dir] = rel.split("/");
      const score = levenshtein(slugify(dir), slug);
      candidates.push({ rel, dir, score });
    }
  } catch {}
  candidates.sort((a, b) => a.score - b.score);
  return candidates.slice(0, 5);
}

async function main() {
  const photosRoot = path.resolve(process.cwd(), "apps/web/public/photos");
  const props = await readPropertiesFromWeb();
  const rows = [];
  for (const p of props) {
    const slug = slugify(p.slug ?? p.title ?? "");
    const expected = path.join(photosRoot, slug, "1.jpg");
    const exists = fssync.existsSync(expected);
    let suggestions = [];
    if (!exists) {
      suggestions = await findClosestMatches(photosRoot, slug);
    }
    rows.push({ slug, expected: path.relative(photosRoot, expected), exists, suggestions });
  }
  // Print table
  console.log("slug\texpectedPath\texists\tsuggestions");
  for (const r of rows) {
    const sugg = r.suggestions.map((s) => s.rel).join(", ");
    console.log(`${r.slug}\t${r.expected}\t${r.exists}\t${sugg}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });







