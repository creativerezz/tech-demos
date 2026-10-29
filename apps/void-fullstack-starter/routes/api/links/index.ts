import { links, insertLinkSchema } from "@schema";
import { defineHandler } from "void";
import { db, desc } from "void/db";

export const GET = defineHandler(async () => {
  const rows = await db.select().from(links).orderBy(desc(links.createdAt));
  return { links: rows };
});

export const POST = defineHandler.withValidator({
  body: insertLinkSchema,
})(async (_c, { body }) => {
  const values = {
    title: body.title,
    url: body.url?.trim() ? body.url.trim() : null,
    note: body.note?.trim() ? body.note.trim() : null,
  };
  const [created] = await db.insert(links).values(values).returning();
  return created;
});
