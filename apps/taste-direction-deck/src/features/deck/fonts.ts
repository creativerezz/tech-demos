import type { TypeSystem } from "./types.ts";

export function stylesheetHrefs(css: string | undefined): string[] {
  if (!css) return [];
  const hrefs: string[] = [];
  for (const match of css.matchAll(/<link\b[^>]*>/g)) {
    const tag = match[0];
    if (!/rel="stylesheet"/.test(tag)) continue;
    const href = tag.match(/href="([^"]+)"/)?.[1];
    if (href) hrefs.push(href);
  }
  return hrefs;
}

export function fontHrefs(types: TypeSystem[]): string[] {
  const hrefs = types.flatMap((type) => [
    ...stylesheetHrefs(type.display.css),
    ...stylesheetHrefs(type.text.css),
  ]);
  return [...new Set(hrefs)];
}

export function fontStack(family: string, typeClass: string): string {
  const quoted = `'${family.replaceAll("'", "")}'`;
  if (typeClass.startsWith("serif") || typeClass === "slab") return `${quoted}, Georgia, serif`;
  if (typeClass === "condensed-heavy" || typeClass === "extended-heavy") {
    return `${quoted}, "Arial Narrow", Impact, sans-serif`;
  }
  return `${quoted}, "Avenir Next", "Segoe UI", sans-serif`;
}
