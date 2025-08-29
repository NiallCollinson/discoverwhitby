#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = "/Users/niallcollinson/discoverwhitby/apps/web";
const PHOTOS_DIR = path.join(ROOT, "public", "photos");
const OUTPUT = path.join(PHOTOS_DIR, "manifest.json");

// Helpers
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const norm = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");

function isImageFile(f) {
  return IMG_EXT.has(path.extname(f).toLowerCase());
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(p));
    } else {
      out.push(p);
    }
  }
  return out;
}

function toWebPath(absPath) {
  // Convert absolute path under /public to /photos/...
  const relFromPublic = absPath.split(path.join(ROOT, "public"))[1];
  return relFromPublic.replace(/\\/g, "/"); // windows-safe
}

function pickBestImage(folderAbs) {
  const entries = fs.readdirSync(folderAbs, { withFileTypes: true });
  const files = [];
  const subfolders = [];

  for (const e of entries) {
    const p = path.join(folderAbs, e.name);
    if (e.isDirectory()) subfolders.push(p);
    else if (e.isFile() && isImageFile(p)) files.push(p);
  }

  const folderName = path.basename(folderAbs);
  const folderNorm = norm(folderName);

  // priority 1: 1.(jpg|jpeg|png|webp|gif)
  const pri1 = files.find((f) => /^1\.(jpg|jpeg|png|webp|gif)$/i.test(path.basename(f)));
  if (pri1) return pri1;

  // priority 2: file name contains folder name + ends with -1.ext
  const pri2 = files.find((f) => {
    const bn = path.basename(f, path.extname(f)).toLowerCase();
    return bn.includes(folderNorm) && /-1$/i.test(bn);
  });
  if (pri2) return pri2;

  // priority 3: any image in subfolders that matches -1 or includes folder token (prefer top-level over deep)
  for (const sub of subfolders) {
    const all = walk(sub).filter(isImageFile);
    const p3a = all.find((f) => /-1\.(jpg|jpeg|png|webp|gif)$/i.test(path.basename(f)));
    if (p3a) return p3a;
    const p3b = all.find((f) => {
      const bn = path.basename(f, path.extname(f)).toLowerCase();
      return bn.includes(folderNorm);
    });
    if (p3b) return p3b;
    if (all[0]) return all[0];
  }

  // priority 4: first image in folder
  if (files[0]) return files[0];

  return null;
}

// Build slug → image map
function buildManifest() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error("Photos dir not found:", PHOTOS_DIR);
    process.exit(1);
  }

  // Known property slugs seen on /properties to assist fuzzy linking
  const knownSlugs = new Set([
    "discovery-accommodation",
    "seabreeze-guesthouse",
    "royal-discovery",
    "silver-street-suites",
    "bluegrass-cottage",
    "starfish-cottage",
    "starfish-house",
    "town-house",
    "the-annex-free-parking",
    "ammonite-free-parking",
  ]);

  // Consider each top-level folder inside /photos as a candidate "collection"
  const top = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true });
  const manifest = {};
  const warnings = [];
  // Manual aliasing: map certain property slugs to specific folders
  // e.g. Coast folder should serve discovery-accommodation
  const manualAliases = {
    "discovery-accommodation": ["bay", "coast", "discovery", "discovery-cottage"],
    "newton-street": ["3 newton", "3-newton", "newton"],
  };

  for (const entry of top) {
    if (!entry.isDirectory()) continue;
    const folderAbs = path.join(PHOTOS_DIR, entry.name);
    const folderSlug = norm(entry.name); // canonical slug from folder
    const best = pickBestImage(folderAbs);
    if (best) {
      const web = toWebPath(best);
      // Base mapping
      manifest[folderSlug] = web;
      // Fuzzy augment: if any known slug contains folder token or vice versa, map that too
      for (const ks of knownSlugs) {
        if (ks.includes(folderSlug) || folderSlug.includes(ks)) {
          manifest[ks] = web;
        }
      }
    } else {
      warnings.push({ folder: entry.name, reason: "no image files found" });
    }
  }

  // Write manifest
  // Apply manual aliases mapping to final manifest
  for (const [destSlug, sources] of Object.entries(manualAliases)) {
    for (const src of sources) {
      const srcKey = norm(src);
      if (manifest[srcKey]) {
        manifest[destSlug] = manifest[srcKey];
        break;
      }
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log("Photo manifest written:", OUTPUT);
  console.table(
    Object.entries(manifest).map(([slug, img]) => ({ slug, img }))
  );
  if (warnings.length) {
    console.warn("Warnings:");
    console.table(warnings);
  }
}

buildManifest();


