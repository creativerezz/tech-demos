import type { DealtDirection, DrawInput } from './types'

function excerpt(text: string, sentences = 2): string {
  return text
    .split(/(?<=\.)\s+/)
    .slice(0, sentences)
    .join(' ')
}

export function buildDesignSnippet(dealt: DealtDirection, input: DrawInput): string {
  const { direction: d, hero, type, palette: c } = dealt
  const lines: string[] = []

  lines.push(`# DESIGN.md — ${d.name}`)
  lines.push('')
  lines.push(`Brief: ${input.brief}`)
  lines.push(`Sector: ${input.sector} · seed ${dealt.seed}`)
  lines.push('')
  lines.push('> Art direction from [Taste Skill v2](https://github.com/Leonxlnx/taste-skill) (MIT). Demo: taste-direction-deck.')
  lines.push('')
  lines.push('| Slot | Choice |')
  lines.push('| --- | --- |')
  lines.push(`| Direction | ${d.name} (\`${d.id}\`) |`)
  lines.push(`| Hero | ${hero.name} (\`${hero.id}\`) |`)
  lines.push(`| Type | ${type.name} |`)
  lines.push(`| Colour | ${c.name} |`)
  lines.push('')
  lines.push('Adopt this direction for the build. Do not blend it with a generic layout template.')
  lines.push('')
  lines.push('## 1. Idea')
  lines.push(d.idea)
  lines.push('')
  lines.push('## 2. Composition')
  lines.push(d.composition)
  lines.push('')
  lines.push(`## 3. Type — ${type.name}`)
  lines.push(type.note)
  lines.push(`- Display: **${type.display.family}** — ${type.display.settings}`)
  lines.push(`- Text: **${type.text.family}** — ${type.text.settings}`)
  if (d.typography) {
    lines.push('')
    lines.push(d.typography)
  }
  lines.push('')
  lines.push(`## 4. Colour — ${c.name}`)
  lines.push('```css')
  lines.push(':root {')
  for (const [key, val] of [
    ['bg', c.bg],
    ['surface', c.surface],
    ['ink', c.ink],
    ['muted', c.muted],
    ['accent', c.accent],
    ['accent-ink', c.accentInk],
  ] as const) {
    lines.push(`  --${key}: ${val};`)
  }
  lines.push('}')
  lines.push('```')
  lines.push(c.note)
  if (d.colour) {
    lines.push('')
    lines.push(d.colour)
  }
  lines.push('')
  lines.push(`## 5. Hero — ${hero.name}`)
  lines.push(excerpt(hero.blueprint, 3))
  lines.push('')
  lines.push('## Agent prompt')
  lines.push(
    `Build a single-page marketing site for "${input.brief}" using the direction "${d.name}". ` +
      `Hero blueprint: ${hero.name}. Palette ${c.name}, type ${type.name}. ` +
      'Follow the idea and composition above; map blueprint sizes onto a consistent type scale.',
  )

  return lines.join('\n')
}
