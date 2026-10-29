# Void Links Board

Minimal **Void** (VoidZero) full-stack demo: a single-page links/notes board with typed API routes, D1/SQLite via Drizzle, and React Pages UI.

## Stack

- [Void](https://void.cloud) SDK + CLI v1.1.11 (pinned; newer npm releases are blocked by this repo’s 3-day `minimumReleaseAge` in `bunfig.toml`)
- React Pages (`@void/react`) + file-based routes in `routes/`
- Local D1 emulation (Miniflare) — **no Cloudflare credentials** required for dev

## Run locally

```bash
cd apps/void-fullstack-starter
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

Apply or reset the local database:

```bash
bunx void db migrate   # or: void db reset --yes
```

## What’s in the app

| Piece | Location |
|-------|----------|
| Schema | `db/schema.ts` — `links` table |
| List + create | `GET` / `POST` `routes/api/links/index.ts` |
| Delete | `DELETE` `routes/api/links/[id].ts` |
| UI | `pages/index.tsx` — calls APIs via `fetch` from `void/client` |

## Static assets / preview base path

Vite `base` is `process.env.VITE_BASE ?? '/'` so a monorepo preview can serve the client bundle under `/void-fullstack-starter/`. The app is **not** a static SPA only: production output includes a Cloudflare Worker (`dist/ssr/`) that serves Pages SSR and API routes. A pure static host cannot run the API or SSR without Void’s worker deployment.

## What `void deploy` would provision

On a Cloudflare account, `void deploy` (after `void connect` or interactive sign-in) would typically:

1. **Build** client + worker artifacts from this project
2. **Provision** a **D1** database binding for the `links` table (SQLite at the edge)
3. **Apply** SQL migrations from `db/migrations/` to that D1 instance
4. **Deploy** a **Worker** (and associated assets) with routes for `/`, `/api/*`, and Void Pages
5. **Configure** worker `compatibility_date` and env secrets from your Void env schema (none required for this MVP)

Local dev uses the same schema and migrations against an emulated D1; only deploy touches your Cloudflare account.

## References

- [Void quickstart](https://void.cloud/guide/quickstart)
- [Server routing](https://void.cloud/guide/server-routing)
- [Database guide](https://void.cloud/guide/database)
- [Cloudflare: Deploy with Void](https://blog.cloudflare.com/deploy-with-void/)
