import { sql } from "void/db";
import { integer, sqliteTable, text } from "void/schema-d1";
import { createInsertSchema } from "void/drizzle-zod";

export const links = sqliteTable("links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url"),
  note: text("note"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const insertLinkSchema = createInsertSchema(links, {
  title: (schema) => schema.trim().min(1).max(200),
  note: (schema) => schema.trim().max(2000).optional(),
}).pick({ title: true, url: true, note: true });
