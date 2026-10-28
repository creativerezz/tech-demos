import directionsJson from "../../../vendor/taste-skill/library/directions.json" with { type: "json" };
import heroesJson from "../../../vendor/taste-skill/library/heroes.json" with { type: "json" };
import palettesJson from "../../../vendor/taste-skill/library/palettes.json" with { type: "json" };
import typeJson from "../../../vendor/taste-skill/library/type.json" with { type: "json" };
import type { Sector } from "./sector.ts";
import type { DealtCard, Direction, Hero, Palette, TypeSystem } from "./types.ts";

// Seeded deal from Taste Skill v2 `scripts/draw.mjs` (commit 12af471).
// History is always empty, which matches a draw with no `~/.taste-skill/history.json`.
// `--options 3` consumes the seed only to pick directions. Hero, type, and palette
// are dealt the way a fresh `--direction <id> --seed <n>` run deals them: the seed restarts.

const directions = directionsJson as Direction[];
const heroes = heroesJson as Hero[];
const palettes = palettesJson as Palette[];
const typeSystems = typeJson as TypeSystem[];

const INTERFACE_SECTORS = new Set(["saas", "dev-tool", "ai-product", "consumer-app", "finance"]);
const PRODUCT_SECTORS = new Set(["physical-product", "ecommerce"]);

export type DealInput = {
  brief: string;
  sector: Sector;
  tone?: string | null;
  have?: string[];
  avoid?: string[];
};

type Rng = {
  next: () => number;
};

export function createRng(startSeed: number): Rng {
  let seed = startSeed;
  return {
    next() {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export function hashSeed(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 2147483646) + 1;
}

export function seedFor(brief: string, sector: Sector, attempt: number): number {
  return hashSeed(`${brief}\n${sector}\n${attempt}`);
}

function fresh<T extends { id: string }>(pool: T[], recentIds: string[]): T[] {
  const unused = pool.filter((item) => !recentIds.includes(item.id));
  return unused.length ? unused : pool;
}

function pick<T>(rng: Rng, pool: T[]): T {
  if (!pool.length) throw new Error("Cannot deal from an empty pool");
  return pool[Math.floor(rng.next() * pool.length)] as T;
}

function imageryMode(input: DealInput): "own" | "interface" | "no-product-photo" | "atmosphere" {
  const have = input.have ?? [];
  if (have.includes("product-photo") || have.includes("photography")) return "own";
  if (INTERFACE_SECTORS.has(input.sector)) return "interface";
  if (PRODUCT_SECTORS.has(input.sector)) return "no-product-photo";
  return "atmosphere";
}

function softwareOnly(hero: Hero): boolean {
  return (
    (hero.directions ?? [])[0] === "product-performs" ||
    (hero.tags ?? []).includes("ui-led") ||
    /data-ui|interface fragment/i.test(hero.blueprint || "")
  );
}

export function directionPool(input: DealInput): Direction[] {
  const have = input.have ?? [];
  const avoid = input.avoid ?? [];
  const has = (need: string) => have.includes(need) || need === "photography";
  let pool = directions.filter(
    (direction) =>
      (direction.sectors.includes(input.sector) || direction.sectors.includes("*")) &&
      !avoid.includes(direction.id),
  );
  const feasible = pool.filter((direction) => (direction.needs ?? []).every(has));
  if (feasible.length) pool = feasible;
  const mode = imageryMode(input);
  if (mode === "interface" || mode === "no-product-photo") {
    const plain = pool.filter((direction) => !direction.needsPictures);
    if (plain.length >= 3) pool = plain;
  }
  if (input.tone) {
    const toned = pool.filter((direction) => (direction.tones ?? []).includes(input.tone as string));
    if (toned.length >= 2) pool = toned;
  }
  if (!pool.length) pool = directions.filter((direction) => !avoid.includes(direction.id));
  return pool;
}

function dealOptions(rng: Rng, input: DealInput, count: number): Direction[] {
  const pool = directionPool(input);
  const dealt: Direction[] = [];
  let rest = fresh(pool, []);
  while (dealt.length < count && pool.length > dealt.length) {
    if (!rest.length) rest = pool.filter((direction) => !dealt.includes(direction));
    const direction = pick(rng, rest);
    dealt.push(direction);
    rest = rest.filter((item) => item !== direction);
  }
  return dealt;
}

function dealHero(rng: Rng, direction: Direction, input: DealInput): Hero {
  const have = input.have ?? [];
  let pool = heroes.filter(
    (hero) => (direction.heroes ?? []).includes(hero.id) || (hero.directions ?? []).includes(direction.id),
  );
  if (!pool.length) pool = heroes;
  if (imageryMode(input) !== "interface" && !have.includes("product-ui")) {
    const plain = pool.filter((hero) => !softwareOnly(hero));
    if (plain.length) pool = plain;
  }
  const eligible = pool.filter(
    (hero) => (hero.needs ?? []).every((need) => need === "photography" || have.includes(need)),
  );
  const fallback = pool;
  const chosen = eligible.length ? eligible : fallback;
  return pick(rng, fresh(chosen, []));
}

function dealType(rng: Rng, direction: Direction): TypeSystem {
  let pool = typeSystems.filter(
    (type) => (direction.type ?? []).includes(type.id) || (direction.typeClasses ?? []).includes(type.class),
  );
  if (!pool.length) pool = typeSystems;
  return pick(rng, fresh(pool, []));
}

function dealPalette(rng: Rng, direction: Direction): Palette {
  let pool = palettes.filter(
    (palette) =>
      (direction.palettes ?? []).includes(palette.id) ||
      (palette.tags ?? []).some((tag) => (direction.paletteTags ?? []).includes(tag)),
  );
  if (!pool.length) pool = palettes;
  return pick(rng, fresh(pool, []));
}

export function deal(input: DealInput, seed: number): DealtCard[] {
  const directionsDealt = dealOptions(createRng(seed), input, 3);
  return directionsDealt.map((direction) => {
    const rng = createRng(seed);
    return {
      direction,
      hero: dealHero(rng, direction, input),
      type: dealType(rng, direction),
      palette: dealPalette(rng, direction),
    };
  });
}
