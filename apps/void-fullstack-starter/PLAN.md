# Void Links Board — PLAN

## Goal

Single-screen demo of **Void** (VoidZero): a typed links/notes board with file-based Hono API routes, D1/SQLite table (create, list, delete), and one React page — runnable locally with `bun install && bun run dev` and no Cloudflare credentials.

## Single-user MVP

**In scope**

- Scaffold from official `create void` (React + sqlite starter, `--deploy none`)
- `db/schema.ts`: `links` table (title, url optional, note optional, createdAt)
- API routes: `GET/POST /api/links`, `DELETE /api/links/:id`
- One client page: form to add, list with delete
- shadcn/ui minimalist styling
- README with local dev + “What `void deploy` would provision”
- Vite `base`: `process.env.VITE_BASE ?? '/'`

**Out of scope**

- Auth, multi-user, edit/update, tags, search
- Production deploy or Cloudflare sign-in in this PR
- Full parity with Void starter demo data (custom schema only)

## Stack

| Choice | Rationale |
|--------|-----------|
| Void SDK + CLI (`void init` / `create void`) | Required product; official scaffold |
| React + Vite+ toolchain | Void default, matches sqlite starter |
| D1 (SQLite) via `void/schema-d1` + `void/db` | Local Miniflare emulation, no credentials |
| shadcn/ui | Monorepo UI default |
| Bun | `AGENTS.md` runtime |

## Tasks (vertical slices)

1. Write this plan; create `bunfig.toml` (done before install)
2. `bunx create void@latest .` with non-interactive flags in app folder
3. Replace starter schema/routes with links board; build UI page
4. Verify `bun run dev`, migrations/push locally
5. README, root index row, `tracking/seen-bookmarks.json`
6. Screenshot + screen recording (create, list, delete); open PR

## Local dev notes

Void runs Vite with Cloudflare runtime locally (Miniflare). If any platform-only feature fails locally, document and mock minimally in README.

## Deferred

- `void deploy` to Cloudflare in CI
- Zod validators from schema (`withValidator`) — add if starter pattern is trivial
- Seed data beyond manual UI entry
