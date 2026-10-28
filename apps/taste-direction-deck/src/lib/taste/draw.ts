import { directions, heroes, palettes, typePairings } from './library'
import { createRng, hashString } from './rng'
import type { DealtDirection, Direction, DrawInput, HeroBlueprint, Palette, TypePairing } from './types'

function imageryMode(input: DrawInput): 'interface' | 'no-product-photo' | 'atmosphere' | 'own' {
  if (input.have.includes('product-photo') || input.have.includes('photography')) return 'own'
  if (['saas', 'dev-tool', 'ai-product', 'consumer-app', 'finance'].includes(input.sector)) {
    return 'interface'
  }
  if (['physical-product', 'ecommerce'].includes(input.sector)) return 'no-product-photo'
  return 'atmosphere'
}

function softwareOnly(h: HeroBlueprint): boolean {
  return /data-ui|interface fragment/i.test(h.blueprint || '')
}

function directionPool(input: DrawInput): Direction[] {
  const has = (need: string) => input.have.includes(need) || need === 'photography'
  let pool = directions.filter(
    (d) => (d.sectors.includes(input.sector) || d.sectors.includes('*')) && !input.avoid.includes(d.id),
  )
  const feasible = pool.filter((d) => (d.needs || []).every(has))
  if (feasible.length) pool = feasible
  const mode = imageryMode(input)
  if (mode === 'interface' || mode === 'no-product-photo') {
    const plain = pool.filter((d) => !d.needsPictures)
    if (plain.length >= 3) pool = plain
  }
  if (input.tone) {
    const toned = pool.filter((d) => (d.tones || []).includes(input.tone!))
    if (toned.length >= 2) pool = toned
  }
  if (!pool.length) pool = directions.filter((d) => !input.avoid.includes(d.id))
  return pool
}

function dealOptions(input: DrawInput, n: number, pick: <T>(arr: T[]) => T): Direction[] {
  const pool = directionPool(input)
  const out: Direction[] = []
  let rest = [...pool]
  while (out.length < n && pool.length > out.length) {
    if (!rest.length) rest = pool.filter((d) => !out.includes(d))
    const d = pick(rest)
    out.push(d)
    rest = rest.filter((x) => x !== d)
  }
  return out
}

function dealHero(dir: Direction, input: DrawInput, pick: <T>(arr: T[]) => T): HeroBlueprint {
  let pool = heroes.filter(
    (h) => (dir as Direction & { heroes?: string[] }).heroes?.includes(h.id) || h.directions?.includes(dir.id),
  )
  if (!pool.length) pool = heroes
  if (imageryMode(input) !== 'interface' && !input.have.includes('product-ui')) {
    const plain = pool.filter((h) => !softwareOnly(h))
    if (plain.length) pool = plain
  }
  return pick(pool.length ? pool : heroes)
}

function dealType(dir: Direction, pick: <T>(arr: T[]) => T): TypePairing {
  const dirType = dir as Direction & { type?: string[] }
  let pool = typePairings.filter(
    (t) => dirType.type?.includes(t.id) || (dir.typeClasses || []).includes(t.class),
  )
  if (!pool.length) pool = typePairings
  return pick(pool)
}

function dealPalette(dir: Direction, pick: <T>(arr: T[]) => T): Palette {
  const dirPal = dir as Direction & { palettes?: string[] }
  let pool = palettes.filter(
    (p) => dirPal.palettes?.includes(p.id) || (p.tags || []).some((t) => (dir.paletteTags || []).includes(t)),
  )
  if (!pool.length) pool = palettes
  return pick(pool)
}

export function dealThreeDirections(input: DrawInput): DealtDirection[] {
  const baseSeed = hashString(`${input.brief}|${input.sector}`)
  const rng = createRng(baseSeed)
  const chosen = dealOptions(input, 3, rng.pick)

  return chosen.map((direction, index) => {
    const slotRng = createRng(baseSeed + index * 9973 + 1)
    return {
      direction,
      hero: dealHero(direction, input, slotRng.pick),
      type: dealType(direction, slotRng.pick),
      palette: dealPalette(direction, slotRng.pick),
      seed: baseSeed + index,
    }
  })
}
