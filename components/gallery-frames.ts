/**
 * The gallery manifest.
 *
 * Kept out of `Gallery.tsx` because that file is a client component, and a
 * client module's exports are replaced by client references when a server
 * component imports them — `app/page.tsx` needs the real array to check which
 * files are on disk.
 *
 * Order is load-bearing. `ROW_PATTERN` in `Gallery.tsx` cuts this list into rows
 * of 1 / 2 / 3 / 2 / 3 / 1, and each row size has its own tile shape — a
 * full-width banner, a wide half, a tall third. So the landscapes have to sit
 * in the 1- and 2-tile rows and the portraits in the 3-tile rows, or a photo
 * ends up in a tile the wrong way round. The set happens to split 6 and 6,
 * which is exactly what this pattern needs.
 */

export const GALLERY_DIR = "/gallery/";

export type Frame = {
  file: string;
  tag: string;
  alt: string;
  /**
   * `object-position` for the square crop. Only needed where centring the
   * frame doesn't centre the subject — a wide shot with the two of you off to
   * one side loses you to the crop otherwise.
   */
  focus?: string;
};

export const FRAMES: Frame[] = [
  {
    file: "proposal.jpg",
    tag: "The proposal",
    alt: "On one knee on a headland in Batanes, the sea and the cows behind us",
    focus: "16% center",
  },  // landscape — full-width lead
  {
    file: "lake-family.jpg",
    tag: "Family",
    alt: "A selfie with family by the lake",
  },
  {
    file: "baguio-group.jpg",
    tag: "Road trips",
    alt: "A group selfie on a Baguio trip",
  },  // two landscapes
  {
    file: "batanes-coast.jpg",
    tag: "The long view",
    alt: "Standing together on a grassy ridge above the sea",
  },
  {
    file: "i-love-batanes.jpg",
    tag: "I ♥ Batanes",
    alt: "At the I love Batanes sign below the Basco lighthouse",
  },
  {
    file: "da-figura.jpg",
    tag: "Da Figura",
    alt: "Lunch for two at Da Figura Cafe",
  },  // three portraits
  {
    file: "batanes-hill.jpg",
    tag: "Batanes",
    alt: "The two of us sitting on a hilltop above the Batanes coastline",
  },
  {
    file: "family-lunch.jpg",
    tag: "Sunday lunch",
    alt: "Sunday lunch around the table with family",
  },  // two landscapes
  {
    file: "st-bernard.jpg",
    tag: "New friend",
    alt: "The two of us with a very large Saint Bernard",
  },
  {
    file: "couch.jpg",
    tag: "Quiet days",
    alt: "An ordinary afternoon at home on the couch",
  },
  {
    file: "baguio-overlook.jpg",
    tag: "Above the pines",
    alt: "Looking out over the mountains together",
  },  // three portraits
  {
    file: "marlboro-arms.jpg",
    tag: "Marlboro Hills",
    alt: "Arms raised over the cove at Racuh a Payaman",
  },  // landscape — full-width close
];

/** Every file the gallery wants — used by the page to warn about missing ones. */
export const GALLERY_PHOTOS = FRAMES.map((f) => f.file);
