CREATE TABLE "guests" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"name_normalized" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"name_normalized" text NOT NULL,
	"attending" boolean NOT NULL,
	"dietary_notes" text,
	"decline_message" text,
	"message" text,
	"song_request" varchar(200),
	"matched_guest_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_matched_guest_id_guests_id_fk" FOREIGN KEY ("matched_guest_id") REFERENCES "public"."guests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "guests_name_normalized_idx" ON "guests" USING btree ("name_normalized");