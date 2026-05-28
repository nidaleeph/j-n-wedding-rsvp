import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * `guests` — the couple's invitation list (entered manually by the couple).
 * Guests RSVP by typing their full name; we match by `nameNormalized`
 * (lowercased + whitespace-collapsed) so "Maria  Santos " matches "maria santos".
 *
 * A guest is "matched" if a row exists with the same normalized name.
 */
export const guests = pgTable(
  "guests",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    nameNormalized: text("name_normalized").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    nameNormIdx: uniqueIndex("guests_name_normalized_idx").on(t.nameNormalized),
  })
);

/**
 * `rsvps` — every submitted RSVP. Stored even if the name doesn't match
 * a known guest, so the couple can review unmatched submissions.
 */
export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  nameNormalized: text("name_normalized").notNull(),
  attending: boolean("attending").notNull(),
  dietaryNotes: text("dietary_notes"),
  declineMessage: text("decline_message"),
  message: text("message"),
  songRequest: varchar("song_request", { length: 200 }),
  matchedGuestId: integer("matched_guest_id").references(() => guests.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
