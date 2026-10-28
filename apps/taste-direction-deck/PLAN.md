# Taste Direction Deck — PLAN

## Goal

Single-screen demo that lets a user type a brief, deal three art-direction cards from the Taste Skill v2 research library, preview each on a hero block, pick one, and copy a `DESIGN.md`-style prompt for their coding agent.

## Single-user MVP

**In scope**

- Brief input with deterministic sector guess from keywords
- “Deal” button draws 3 directions from vendored `directions.json` using the same pool/filter logic as `draw.mjs` (seed derived from brief text)
- Each card: direction name, idea excerpt, palette swatches, type pairing label, simplified hero preview for the brief
- Select a card → panel with full snippet + copy button
- MIT attribution to [taste-skill](https://github.com/Leonxlnx/taste-skill)

**Out of scope**

- Backend, LLM calls, browser self-inspection, archive asset search, history file (`~/.taste-skill/history.json`)
- Full direction sheet / section blueprints (abbreviated `DESIGN.md` only)

## Data approach

Vendor JSON from upstream `skills/taste-skill/library/` (`directions`, `palettes`, `type`, `heroes`) into `src/vendor/taste-skill/library/`. Port core dealing helpers from `scripts/draw.mjs` (seeded RNG, `directionPool`, `dealOptions`, `dealType`, `dealPalette`, `dealHero`) in TypeScript. No runtime dependency on Node draw script.

## Stack

| Choice | Rationale |
|--------|-----------|
| Vite + React + TS (`bunx create-vite`) | Official scaffold, fast dev, one screen |
| shadcn/ui minimalist | Repo default UI |
| Bun | Monorepo runtime per `AGENTS.md` |

## Tasks (vertical slices)

1. Scaffold app + shadcn + `bunfig.toml`
2. Vendor library JSON + TypeScript draw engine
3. Hero preview components (archetype-based mini layouts)
4. Main UI: brief → deal → cards → select → copy snippet
5. README row + tracking entry; screenshot + screen recording for PR

## Deferred

- `--redraw` slots, photo sets, scenes, full render parity with CLI
- Sector/tone picker UI (auto-infer only for MVP)
