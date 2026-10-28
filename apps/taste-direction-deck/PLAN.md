# Taste Direction Deck

## Goal

A single screen that deals three Taste Skill v2 art directions for a short brief, previews each one on a sample hero, and copies a `DESIGN.md` snippet a coding agent can follow.

## MVP

In scope:

- One user, one screen, no account, no backend, no LLM.
- Brief text plus a sector (inferred from the brief, overridable).
- Three cards from the vendored direction pool. Same brief, sector, and deal number always produce the same three cards.
- Each card shows the dealt palette, type pairing, and a sample hero laid out in that hero's archetype, using the brief as the words.
- Pick one card and copy a `DESIGN.md` prompt snippet (direction, type, colour, hero blueprint).
- Credit Taste Skill v2 (MIT, Copyright (c) 2026 Leonxlnx).

Out of scope:

- Running `draw.mjs`, the browser inspector, archive photo search, scroll scenes, or section blueprints beyond the hero.
- Accounts, persistence, and a server.

## Decision

Vendor the library. `skills/taste-skill/library/` holds the direction pool as JSON (`directions.json`, `heroes.json`, `type.json`, `palettes.json`). `skills/taste-skill/scripts/draw.mjs` deals three directions with a seedable mulberry32 PRNG. The classic style skills (soft, minimalist, brutalist) are not in this repo, so the gallery fallback is unnecessary.

Vendor those four files plus the upstream `LICENSE`, pinned to commit `12af471f627f866411b4bd785b19646d3672784c`. Port only `directionPool`, `dealOptions`, `dealHero`, `dealType`, and `dealPalette`, with an empty history. Skip photographs, sections, sites, and motions: picture regions in the preview are flat palette fields, not remote images.

## Tasks

1. Scaffold Vite React TypeScript, then shadcn/ui Lyra (the minimalist preset), with `bunfig.toml` written before any install.
2. Vendor the four JSON files and the MIT license under `vendor/taste-skill/`.
3. Port the dealer and the snippet writer. Test that a known seed matches `draw.mjs --options 3`, that the three directions are distinct and in the sector pool, and that the snippet names the direction and palette.
4. Build the screen: brief, deal, three hero cards, pick, copy.
5. Run it, then record the brief → three cards → pick → copy path.

## Stack

- **Vite + React + TypeScript** via `bunx create-vite`. One client screen does not need a server framework.
- **Bun** for install, scripts, and `bun test`.
- **shadcn/ui Lyra** (`bunx shadcn@latest init --preset lyra`). Boxy, sharp, neutral: the tool chrome stays quiet so the dealt heroes can be loud.
- **Vendored Taste Skill JSON** instead of a runtime dependency or an LLM. The deal stays deterministic and offline.

Tradeoff against Next.js: the App Router would add a server this screen never calls. Tradeoff against shelling out to `draw.mjs`: that script loads the whole library (including an 869KB site index) and Node, and it writes history on disk. A small port of the deal stays inside `bun run dev`.

## Layout

- `vendor/taste-skill/` — upstream JSON, `LICENSE`, source note. Not edited.
- `src/features/deck/dealer.ts` — seed, pool, deal.
- `src/features/deck/snippet.ts` — `DESIGN.md` text.
- `src/features/deck/sector.ts` — brief → sector.
- `src/features/deck/HeroPreview.tsx` — one miniature per hero archetype.
- `src/features/deck/DeckScreen.tsx` — the only screen.
- `src/App.tsx` — renders the screen.

## Testing and hooks

- `bun test` for the dealer and the snippet. No component test runner.
- No git hooks. The app is one folder and CI is not part of this demo.

## Deferred

- Full direction sheets (sections, motion, photographs, studied-site references). The snippet points at the upstream skill for those.
- Redraw of a single slot, tone filter, and `--have` asset flags. Sector plus an empty asset list matches the default page draw.
- Keeping the port in lockstep with later upstream commits. The vendored commit is recorded in `vendor/taste-skill/SOURCE.md`.
