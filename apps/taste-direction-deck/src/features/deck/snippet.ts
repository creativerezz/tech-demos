import { SECTOR_LABELS, type Sector } from "./sector.ts";
import type { DealtCard } from "./types.ts";

const UPSTREAM = "https://github.com/Leonxlnx/taste-skill";
const COMMIT = "12af471f627f866411b4bd785b19646d3672784c";

function rootBlock(entries: [string, string][]): string {
  const lines = entries.map(([name, value]) => `  --${name}: ${value};`);
  return [":root {", ...lines, "}"].join("\n");
}

function section(title: string, body: string | undefined): string[] {
  const text = body?.trim();
  if (!text) return [];
  return [`## ${title}`, "", text, ""];
}

export function designMarkdown(card: DealtCard, brief: string, sector: Sector, seed: number): string {
  const { direction, hero, type, palette } = card;
  const colour = rootBlock([
    ["bg", palette.bg],
    ["surface", palette.surface],
    ["ink", palette.ink],
    ["muted", palette.muted],
    ["accent", palette.accent],
    ["accent-ink", palette.accentInk],
    ...(palette.fields ?? []).flatMap((field, index) => {
      const entries: [string, string][] = [[`field-${index + 1}`, field.bg]];
      if (field.ink) entries.push([`field-${index + 1}-ink`, field.ink]);
      return entries;
    }),
  ]);
  const scale = type.scale ? rootBlock(Object.entries(type.scale)) : "";
  const fontLinks = [...new Set([type.display.css, type.text.css].filter((css): css is string => Boolean(css)))].join(
    "\n",
  );
  const parts = [
    "# DESIGN.md",
    "",
    `Build a page for: ${brief}`,
    "",
    "Hand this sheet to the coding agent. Adopt it. Do not blend it with a generic centered layout.",
    `Source: Taste Skill v2 (MIT, Copyright (c) 2026 Leonxlnx) — ${UPSTREAM}`,
    `Vendored library commit ${COMMIT}.`,
    `Sector: ${sector} (${SECTOR_LABELS[sector]}). Seed: ${seed}.`,
    "",
    `## Direction — ${direction.name} (\`${direction.id}\`)`,
    "",
    "### Idea",
    "",
    direction.idea.trim(),
    "",
    "Before building, write one sentence: on this page, something that belongs only to this subject becomes the device this direction calls for.",
    "",
    "### Composition",
    "",
    direction.composition.trim(),
    "",
    ...section("Typography", direction.typography),
    ...section("Colour note", direction.colour),
    ...section("Imagery", direction.imagery),
    `## Type — ${type.name}`,
    "",
    type.note?.trim() ?? "",
    "",
    "```html",
    fontLinks,
    "```",
    "",
    `- Display: **${type.display.family}** — ${type.display.settings}`,
    `- Text: **${type.text.family}** — ${type.text.settings}`,
    "",
    ...(scale ? ["```css", scale, "```", ""] : []),
    `## Colour — ${palette.name}`,
    "",
    "```css",
    colour,
    "```",
    "",
    palette.note?.trim() ?? "",
    "",
    `## Hero — ${hero.name}`,
    "",
    hero.blueprint.trim(),
    "",
    `On a phone: ${hero.mobile.trim()}`,
    ...(hero.headline ? ["", `Headline: ${hero.headline.trim()}`] : []),
    "",
    ...section("Where the richness comes from", direction.richness),
    ...section("How this direction goes wrong", direction.pitfalls),
    "## Always",
    "",
    "Headlines in two lines or fewer at every width. One clear title on the first screen. Equal outer margins.",
    "No eyebrow labels, no monospace outside code, no index numbering, no thin rules, no gradients, no shadows at rest.",
    "One ground, one ink, one accent. Picture regions use real pictures of this subject's world, credited, or flat colour. Do not invent a fake photograph.",
    "",
  ];
  return parts.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n");
}
