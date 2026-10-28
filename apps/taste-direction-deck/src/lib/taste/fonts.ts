/** Extract first stylesheet href from Taste Skill font bundle HTML. */
export function fontStylesheetHref(typeCss?: string): string | null {
  if (!typeCss) return null
  const match = typeCss.match(/href="([^"]+)"/)
  return match?.[1] ?? null
}
