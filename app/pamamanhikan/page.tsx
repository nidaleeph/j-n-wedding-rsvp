import fs from "node:fs";
import path from "node:path";
import { Deck } from "@/components/pamamanhikan/Deck";
import { DECK_PHOTOS } from "@/components/pamamanhikan/slides";

const UPLOADS_DIR = path.join(process.cwd(), "public", "pamamanhikan", "uploads");

/**
 * Read the photos that are actually on disk.
 *
 * This runs at build time (the page is static), so dropping a file into
 * `public/pamamanhikan/uploads/` and rebuilding is all it takes to swap a
 * placeholder for the real photo — no code change.
 */
function readAvailablePhotos(): string[] {
  try {
    return fs.readdirSync(UPLOADS_DIR).filter((name) => !name.startsWith("."));
  } catch {
    return [];
  }
}

export default function PamamanhikanPage() {
  const available = readAvailablePhotos();
  const missing = DECK_PHOTOS.filter((file) => !available.includes(file));

  if (missing.length > 0) {
    console.warn(
      `[pamamanhikan] ${missing.length} photo(s) still missing from public/pamamanhikan/uploads/ — ` +
        `showing monogram placeholders for: ${missing.join(", ")}`,
    );
  }

  return <Deck availablePhotos={available} />;
}
