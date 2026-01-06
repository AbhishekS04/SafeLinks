CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"italic_keyword" text,
	"context_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_user_id_unique" UNIQUE("user_id")
);
