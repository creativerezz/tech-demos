export type Sector =
  | 'saas'
  | 'dev-tool'
  | 'ai-product'
  | 'consumer-app'
  | 'finance'
  | 'agency'
  | 'studio-portfolio'
  | 'personal-portfolio'
  | 'ecommerce'
  | 'physical-product'
  | 'fashion'
  | 'hospitality'
  | 'restaurant'
  | 'real-estate'
  | 'architecture'
  | 'event'
  | 'health'
  | 'education'
  | 'nonprofit'
  | 'culture'
  | 'music'
  | 'other'

export interface Direction {
  id: string
  name: string
  sectors: string[]
  tones: string[]
  needs?: string[]
  needsPictures?: boolean
  idea: string
  composition: string
  typography?: string
  colour?: string
  typeClasses?: string[]
  paletteTags?: string[]
  motion?: string
  photos?: boolean
}

export interface Palette {
  id: string
  name: string
  tags?: string[]
  bg: string
  surface: string
  ink: string
  muted: string
  accent: string
  accentInk: string
  note: string
  fields?: { bg: string; ink?: string }[]
}

export interface TypePairing {
  id: string
  name: string
  class: string
  display: {
    family: string
    settings: string
    css?: string
  }
  text: {
    family: string
    settings: string
    css?: string
  }
  note: string
  scale?: Record<string, string>
}

export interface HeroBlueprint {
  id: string
  name: string
  archetype: string
  directions?: string[]
  blueprint: string
  headline?: string
}

export interface DrawInput {
  brief: string
  sector: Sector
  tone?: string | null
  have: string[]
  avoid: string[]
}

export interface DealtDirection {
  direction: Direction
  hero: HeroBlueprint
  type: TypePairing
  palette: Palette
  seed: number
}
