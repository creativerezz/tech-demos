# tech-demos

Sticky monorepo for small daily tech demos. Each demo lives in its own folder under `apps/` and is built by a separate cloud agent.

## Conventions

- **One folder per demo:** `apps/<kebab-slug>/`
- **Self-contained:** each app runs with `bun install && bun run dev`
- **Isolation:** agents touch only their app folder (plus README index row and tracking when instructed)

## Live demos (Cloudflare Pages)

Pushes to `main` and pull requests deploy via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) to a single Pages project: **`tech-demos`**.

| What | URL |
|------|-----|
| Demo index | [https://tech-demos.pages.dev/](https://tech-demos.pages.dev/) |
| Per demo | `https://tech-demos.pages.dev/<slug>/` (e.g. [taste-direction-deck](https://tech-demos.pages.dev/taste-direction-deck/)) |

**Repo secrets required:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

**Local parity with production paths:**

```bash
bash scripts/build-pages-site.sh
bunx serve dist/pages -l 4173
# open http://localhost:4173/taste-direction-deck/
```

## Demos index

| Slug | Tech | Date | PR |
|------|------|------|-----|
| taste-direction-deck | Taste Skill v2 | 2026-10-28 | *(PR pending)* |
