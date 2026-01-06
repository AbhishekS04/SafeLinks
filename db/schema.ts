
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(), // Removed unique() to allow multiple links per user
    url: text("url").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    italicKeyword: text("italic_keyword"),
    contextNote: text("context_note"),
    category: text("category").default("General"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
