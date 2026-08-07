import fs from "node:fs";
import path from "node:path";

import { Atmosphere } from "@/components/Atmosphere";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { GALLERY_PHOTOS } from "@/components/gallery-frames";
import { Hero } from "@/components/Hero";
import { Letters } from "@/components/Letters";
import { Marquee } from "@/components/Marquee";
import { MusicToggle } from "@/components/MusicToggle";
import { Nav } from "@/components/Nav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Rsvp } from "@/components/Rsvp";
import { Story } from "@/components/Story";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");

/**
 * Read the gallery photos that are actually on disk.
 *
 * Same arrangement as the pamamanhikan deck: this runs at build time, so
 * dropping a file into `public/gallery/` and rebuilding is all it takes to add
 * a frame — no code change. A frame whose file is missing is simply skipped.
 */
function readAvailablePhotos(): string[] {
  try {
    return fs.readdirSync(GALLERY_DIR).filter((name) => !name.startsWith("."));
  } catch {
    return [];
  }
}

export default function Page() {
  const available = readAvailablePhotos();
  const missing = GALLERY_PHOTOS.filter((file) => !available.includes(file));

  if (missing.length > 0) {
    console.warn(
      `[gallery] ${missing.length} frame(s) skipped — no file in public/gallery/ for: ` +
        missing.join(", "),
    );
  }

  return (
    <>
      <EnvelopeIntro />
      <Atmosphere />
      <Nav />

      <Hero />

      <Marquee
        items={[
          { text: "Jonathan & Nerizza" },
          { text: "forever & ever", script: true },
          { text: "February 25, 2027" },
          { text: "Tagaytay" },
        ]}
      />

      <Countdown />

      <Story />

      <Marquee
        variant="dark"
        items={[
          { text: "with all our hearts", script: true },
          { text: "YOU ARE INVITED" },
          { text: "two become one", script: true },
          { text: "TAGAYTAY MMXXVII" },
        ]}
      />

      <Letters />
      <Gallery availablePhotos={available} />
      <Details />
      <Rsvp />
      <Footer />

      <MusicToggle />
      <RevealOnScroll />
    </>
  );
}
