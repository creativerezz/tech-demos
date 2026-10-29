#!/usr/bin/env bash
# Assemble all apps/*/ static builds under dist/pages/<slug>/ for Cloudflare Pages.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${ROOT}/dist/pages"
APPS_DIR="${ROOT}/apps"

rm -rf "${OUT}"
mkdir -p "${OUT}"

redirects_file="${OUT}/_redirects"
: > "${redirects_file}"

slugs=()

for app_dir in "${APPS_DIR}"/*/; do
  [[ -d "${app_dir}" ]] || continue
  slug="$(basename "${app_dir}")"
  [[ "${slug}" != ".gitkeep" ]] || continue

  if [[ ! -f "${app_dir}/package.json" ]]; then
    echo "Skipping ${slug}: no package.json"
    continue
  fi

  if ! grep -q '"build"' "${app_dir}/package.json"; then
    echo "Skipping ${slug}: no build script in package.json"
    continue
  fi

  echo "==> Building ${slug} (base=/${slug}/)"
  (
    cd "${app_dir}"
    bun install --frozen-lockfile 2>/dev/null || bun install
    VITE_BASE="/${slug}/" bun run build
  )

  app_dist="${app_dir}/dist"
  if [[ ! -d "${app_dist}" ]]; then
    echo "Error: ${slug} build did not produce dist/" >&2
    exit 1
  fi

  rm -rf "${OUT}/${slug}"
  cp -a "${app_dist}" "${OUT}/${slug}"
  slugs+=("${slug}")

  echo "/${slug}/* /${slug}/index.html 200" >> "${redirects_file}"
done

if [[ ${#slugs[@]} -eq 0 ]]; then
  echo "Warning: no apps were built; index will list zero demos." >&2
fi

index_path="${OUT}/index.html"
{
  echo '<!DOCTYPE html>'
  echo '<html lang="en">'
  echo '<head>'
  echo '  <meta charset="UTF-8" />'
  echo '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
  echo '  <title>tech-demos</title>'
  echo '  <style>'
  echo '    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }'
  echo '    h1 { font-size: 1.5rem; }'
  echo '    ul { padding-left: 1.25rem; }'
  echo '    a { color: #2563eb; }'
  echo '  </style>'
  echo '</head>'
  echo '<body>'
  echo '  <h1>tech-demos</h1>'
  echo '  <p>Sticky monorepo demos on Cloudflare Pages.</p>'
  if [[ ${#slugs[@]} -eq 0 ]]; then
    echo '  <p><em>No demos built yet.</em></p>'
  else
    echo '  <ul>'
    for slug in "${slugs[@]}"; do
      echo "    <li><a href=\"/${slug}/\">${slug}</a></li>"
    done
    echo '  </ul>'
  fi
  echo '</body>'
  echo '</html>'
} > "${index_path}"

echo "Assembled ${#slugs[@]} demo(s) at ${OUT}"
