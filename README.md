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

## Deploy to Vercel

This project deploys to Vercel cleanly — Next.js is auto-detected, no
`vercel.json` needed. The only out-of-the-box infra you have to set up is the
database. We recommend **Neon** (native Postgres, scales-to-zero free tier).

### 1. Create the database (Neon)

1. Go to <https://neon.tech> → New Project → name it `jn-wedding`, region close
   to your visitors (e.g. **AWS Singapore** for PH guests).
2. From the dashboard, copy the **Pooled connection string**. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```
   The **pooled** variant is important — Vercel serverless functions open
   short-lived connections, and Neon's pooler keeps that scalable.

### 2. Apply the schema to your Neon DB

Once locally, against the new database, with the URL from step 1:

```bash
DATABASE_URL='postgresql://...neon...?sslmode=require' npm run db:migrate
```

This runs the SQL file under [`drizzle/`](drizzle/) and creates the `guests`
and `rsvps` tables. (You only need to do this once on first deploy, and again
whenever you change `db/schema.ts` — re-run `npm run db:generate` to produce a
new SQL file first, commit it, then re-run migrate.)

### 3. Push the code to GitHub

```bash
git init
git add -A
git commit -m "initial deploy"
gh repo create jn-wedding-rsvp --private --source=. --push
# (or create a repo manually and push)
```

### 4. Import on Vercel

1. <https://vercel.com/new> → import the repo.
2. **Framework Preset:** Next.js (auto-detected).
3. **Environment Variables** — add one:
   - `DATABASE_URL` = the same pooled Neon URL from step 1
   - Apply to: Production, Preview, Development (or at least Production)
4. Click **Deploy**.

> **Tip:** If you used Neon's "Vercel Postgres" integration from the Vercel
> marketplace, the env var is wired automatically and you can skip step 3.

### 5. Seed the invitation list (anytime)

```bash
DATABASE_URL='postgresql://...neon...?sslmode=require' \
  psql -c "INSERT INTO guests (full_name, name_normalized) VALUES
    ('Maria Santos', 'maria santos'),
    ('Juan Dela Cruz', 'juan dela cruz');"
```

Submitted RSVPs whose name doesn't match a row in `guests` are still stored
(`matched_guest_id` will be `NULL`) so you can spot typos and fix them.

## Audio

- Source: `public/audio/out-of-my-league.mp3` (4.3 MB, 160 kb/s).
- The raw `.wav` source is **ignored by git** (see `.gitignore`) so it never
  ships to Vercel — only the encoded MP3 does. If you re-export the song,
  drop a new `.wav` next to the MP3 and re-run:
  ```bash
  ffmpeg -y -i public/audio/out-of-my-league.wav \
    -codec:a libmp3lame -b:a 160k -ar 44100 \
    public/audio/out-of-my-league.mp3
  ```

## Costs at a glance

- **Vercel Hobby:** free; covers this site easily.
- **Neon Free:** 0.5 GB storage, scales to zero. Plenty of room for an RSVP list.
- **Bandwidth:** the 4.3 MB MP3 dominates — ~430 MB per 100 guest plays.
  Hobby plan includes 100 GB/month, so you have ~23 000 plays before hitting
  the cap.
