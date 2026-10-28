import directionsJson from '@/vendor/taste-skill/library/directions.json'
import heroesJson from '@/vendor/taste-skill/library/heroes.json'
import palettesJson from '@/vendor/taste-skill/library/palettes.json'
import typeJson from '@/vendor/taste-skill/library/type.json'

import type { Direction, HeroBlueprint, Palette, TypePairing } from './types'

export const directions = directionsJson as Direction[]
export const palettes = palettesJson as Palette[]
export const typePairings = typeJson as TypePairing[]
export const heroes = heroesJson as HeroBlueprint[]
