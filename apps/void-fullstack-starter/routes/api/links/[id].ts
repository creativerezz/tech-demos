import { links } from "@schema";
import { defineHandler } from "void";
import { db, eq } from "void/db";

export const DELETE = defineHandler(async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: "Invalid id" }, 400);
  }

  const deleted = await db.delete(links).where(eq(links.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }

  return { ok: true, id };
});
