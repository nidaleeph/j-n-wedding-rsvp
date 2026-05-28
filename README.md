# Jonathan & Nerizza · Wedding RSVP

A Next.js + Drizzle + Postgres implementation of the wedding RSVP design.

- **Date:** February 25, 2027 (Thursday)
- **Venue:** Jardin de Milagros, Tagaytay — Pavilion (4:00 PM) & Garden (6:00 PM)
- **RSVP rule:** match guests by **name only** (no email, no guest count, no meal selection)

## Stack

- **Next.js 15** (App Router, TypeScript, React 19)
- **Drizzle ORM** + **postgres-js** for the database layer
- Vanilla CSS in `app/globals.css` — ported verbatim from the design prototype, so the visual is pixel-faithful
- Single page (`/`) with one API route (`POST /api/rsvp`)

## Getting started

```bash
# 1. install
pnpm install   # or: npm install / yarn

# 2. configure the DB
cp .env.example .env.local
# edit .env.local and set DATABASE_URL

# 3. create tables
pnpm db:push   # development: pushes schema directly
# or for production: pnpm db:generate && pnpm db:migrate

# 4. dev
pnpm dev
# → http://localhost:3000
```

### Database

The schema lives in [`db/schema.ts`](db/schema.ts):

| Table   | Purpose                                                                     |
| ------- | --------------------------------------------------------------------------- |
| `guests` | The couple's invitation list. Name + normalized name (unique).             |
| `rsvps`  | One row per submitted RSVP. Links to `guests` by id when a name matches.   |

Name matching is done on `name_normalized` (lowercased, whitespace-collapsed) so
`"Maria  Santos "` matches `"maria santos"`.

When a guest submits a name that doesn't match any row in `guests`, the RSVP is
still stored — `matched_guest_id` is null. The couple can review unmatched
RSVPs in Drizzle Studio (`pnpm db:studio`).

To seed the guest list before the invites go out:

```sql
INSERT INTO guests (full_name, name_normalized) VALUES
  ('Maria Santos', 'maria santos'),
  ('Juan Dela Cruz', 'juan dela cruz');
```

(Or write a small script under `scripts/` — `normalizeName` is exported from `db/schema.ts`.)

## Project structure

```
app/
  layout.tsx           — root html, fonts
  page.tsx             — composes the page from section components
  globals.css          — full design CSS (emerald/gold palette, animations)
  api/rsvp/route.ts    — POST handler, inserts into rsvps, attempts guest match
components/
  EnvelopeIntro.tsx    — opening envelope animation (client)
  Atmosphere.tsx       — drifting petals & gold particles (client)
  Nav.tsx              — sticky nav + drawer menu (client)
  Hero.tsx             — cinematic hero with letter-by-letter names
  Marquee.tsx          — scrolling ribbon bands
  Countdown.tsx        — live countdown to the wedding (client)
  Story.tsx            — three story chapters with images
  Letters.tsx          — handwritten notes from bride & groom
  Gallery.tsx          — asymmetric photo mosaic
  Details.tsx          — ceremony, reception, dress code, palette
  Rsvp.tsx             — 4-step form + confirmation (client)
  Footer.tsx           — monogram + closing line
  RevealOnScroll.tsx   — IntersectionObserver helper (client)
db/
  schema.ts            — guests + rsvps tables
  index.ts             — drizzle client
drizzle.config.ts
```

## Things to swap before going live

1. **Photos** — the prototype uses Unsplash placeholders. Replace the URLs in:
   - [`app/globals.css`](app/globals.css) — `.hero-bg` background image
   - [`components/Story.tsx`](components/Story.tsx) — `chapters[].image`
   - [`components/Gallery.tsx`](components/Gallery.tsx) — `items[].src`
2. **Gift details** — the bank account number, GCash number, and QR pattern in
   [`components/Rsvp.tsx`](components/Rsvp.tsx) are placeholders. The QR is a
   stylized SVG — render a real QR image once you have one.
3. **Map link** — `https://maps.google.com/?q=Jardin+de+Miracles+Tagaytay` in
   [`components/Details.tsx`](components/Details.tsx). Swap for the exact pin.
4. **Seed the `guests` table** — see SQL example above.

## Deploy

Designed to deploy to Vercel without modification. Push to a Git repo,
import into Vercel, add `DATABASE_URL` as an environment variable, and ship.
Vercel Postgres, Neon, and Supabase all work.
