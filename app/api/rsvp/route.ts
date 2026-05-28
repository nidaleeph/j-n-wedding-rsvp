import { NextResponse } from "next/server";
import { db, guests, normalizeName, rsvps } from "@/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

type Payload = {
  fullName?: unknown;
  attending?: unknown;
  dietaryNotes?: unknown;
  declineMessage?: unknown;
  message?: unknown;
  songRequest?: unknown;
};

function asTrimmedString(v: unknown, max = 2000): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.slice(0, max);
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fullName = asTrimmedString(body.fullName, 200);
  if (!fullName) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (typeof body.attending !== "boolean") {
    return NextResponse.json({ error: "Missing attending choice." }, { status: 400 });
  }

  const nameNorm = normalizeName(fullName);
  const dietaryNotes = body.attending ? asTrimmedString(body.dietaryNotes, 500) : null;
  const declineMessage = !body.attending ? asTrimmedString(body.declineMessage, 1000) : null;
  const message = body.attending ? asTrimmedString(body.message, 1000) : null;
  const songRequest = body.attending ? asTrimmedString(body.songRequest, 200) : null;

  // Try to match an invited guest by normalized name (best-effort; we still accept the RSVP).
  let matchedGuestId: number | null = null;
  try {
    const matches = await db
      .select({ id: guests.id })
      .from(guests)
      .where(eq(guests.nameNormalized, nameNorm))
      .limit(1);
    matchedGuestId = matches[0]?.id ?? null;
  } catch {
    // Table may not exist yet on first run — proceed without a match.
  }

  const [row] = await db
    .insert(rsvps)
    .values({
      fullName,
      nameNormalized: nameNorm,
      attending: body.attending,
      dietaryNotes,
      declineMessage,
      message,
      songRequest,
      matchedGuestId: matchedGuestId ?? undefined,
    })
    .returning({ id: rsvps.id });

  return NextResponse.json({ ok: true, id: row.id, matched: matchedGuestId !== null });
}
