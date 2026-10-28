import { describe, expect, test } from "bun:test";
import { deal, directionPool, hashSeed, seedFor } from "./dealer.ts";
import { inferSector } from "./sector.ts";
import { designMarkdown } from "./snippet.ts";

const coffee = {
  brief: "neighborhood coffee roaster",
  sector: "restaurant" as const,
  have: [] as string[],
  avoid: [] as string[],
  tone: null,
};

describe("inferSector", () => {
  test("reads a coffee roaster as a restaurant", () => {
    expect(inferSector("neighborhood coffee roaster")).toBe("restaurant");
  });

  test("falls back when the brief has no signal", () => {
    expect(inferSector("hello there")).toBe("other");
  });
});

describe("deal", () => {
  test("matches draw.mjs for seed 12345", () => {
    const cards = deal(coffee, 12345);
    expect(cards.map((card) => card.direction.id)).toEqual(["dark-room", "place-carries-it", "one-motif"]);
    expect(cards.map((card) => card.hero.name)).toEqual([
      "Title from the top edge to the bottom edge",
      "View with two cards in the corner",
      "Giant cropped shape",
    ]);
    expect(cards.map((card) => card.type.name)).toEqual([
      "Panchang / Switzer",
      "Big Shoulders / Public Sans",
      "Hanken Grotesk",
    ]);
    expect(cards.map((card) => card.palette.name)).toEqual([
      "Forest and lime",
      "Charcoal and sage",
      "Blush and aubergine",
    ]);
  });

  test("matches draw.mjs direction ids for seed 1", () => {
    const cards = deal(coffee, 1);
    expect(cards.map((card) => card.direction.id)).toEqual(["split-stage", "name-as-monument", "one-motif"]);
  });

  test("is stable for the same seed and changes when the seed changes", () => {
    const first = deal(coffee, 12345).map((card) => card.direction.id).join();
    const again = deal(coffee, 12345).map((card) => card.direction.id).join();
    const other = deal(coffee, 2).map((card) => card.direction.id).join();
    expect(first).toBe(again);
    expect(other).not.toBe(first);
  });

  test("keeps product-photo directions out of a brief with no photographs", () => {
    const ids = directionPool(coffee).map((direction) => direction.id);
    expect(ids).not.toContain("hero-object");
    expect(ids).not.toContain("specimen-catalogue");
    expect(ids.length).toBeGreaterThanOrEqual(3);
  });
});

describe("seedFor", () => {
  test("hashes the same brief to the same seed", () => {
    expect(seedFor("neighborhood coffee roaster", "restaurant", 0)).toBe(
      hashSeed("neighborhood coffee roaster\nrestaurant\n0"),
    );
    expect(seedFor("neighborhood coffee roaster", "restaurant", 0)).toBe(
      seedFor("neighborhood coffee roaster", "restaurant", 0),
    );
    expect(seedFor("neighborhood coffee roaster", "restaurant", 1)).not.toBe(
      seedFor("neighborhood coffee roaster", "restaurant", 0),
    );
  });
});

describe("designMarkdown", () => {
  test("names the direction, the palette, and the brief", () => {
    const card = deal(coffee, 12345)[0];
    if (!card) throw new Error("expected a card");
    const markdown = designMarkdown(card, coffee.brief, coffee.sector, 12345);
    expect(markdown.startsWith("# DESIGN.md\n")).toBe(true);
    expect(markdown).toContain("The dark room");
    expect(markdown).toContain(card.palette.bg);
    expect(markdown).toContain("neighborhood coffee roaster");
    expect(markdown).toContain("Leonxlnx");
  });
});
