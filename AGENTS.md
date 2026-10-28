# Cloud agent rules (tech-demos)

Every cloud agent building a demo in this repo must follow these rules.

## Scope

- Touch **only** `apps/<slug>/` for your demo.
- You may also update **one row** in the README demos index table and `tracking/seen-bookmarks.json` when explicitly told to.
- **Never** modify other apps, shared config outside this contract, or unrelated repo files.

## Planning

- Plan first using `skills/project-planning/SKILL.md`.
- Write `apps/<slug>/PLAN.md` **before** writing application code.

## Hosting (Cloudflare Pages)

All demos deploy from **one** Cloudflare Pages project (`tech-demos`). Each app is served at **`https://tech-demos.pages.dev/<slug>/`**.

- **`bun run build`** must produce a **static** output directory (typically `dist/`).
- Apps must support a **sub-path base** for production builds. Set Vite (or your bundler) `base` from the **`VITE_BASE`** env var (e.g. `VITE_BASE=/<slug>/` in CI). **`bun run dev`** must keep working at **`/`** when `VITE_BASE` is unset.
- CI runs `scripts/build-pages-site.sh`, which builds every app under `apps/*/` and assembles `dist/pages/<slug>/`. Do not add per-app Pages projects.

## Runtime and tooling

- **Bun** is the runtime, package manager, and script runner for every app.
- Every app must have its own `bunfig.toml` with:

  ```toml
  [install]
  minimumReleaseAge = 259200
  ```

  Create this **before** any `bun install`.

- Start from an official scaffold via `bunx create-*` (do not hand-roll project skeletons).
- **UI default:** shadcn/ui with a minimalist preset. Add components on demand.

## Product bar

- Build for a **single user**, MVP-first.
- Prefer **prebuilt** solutions over bespoke code.

## Pull requests

- Open **exactly one PR** per demo.
- The PR **must** include at least **one screenshot** and at least **one video** (screen recording) of the running app as validation artifacts. This is **not optional**.

## Repositories

- **Never** create a new repository. All demos stay in this monorepo.
