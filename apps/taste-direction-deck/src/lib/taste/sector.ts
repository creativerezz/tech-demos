import type { Sector } from './types'

const RULES: { sector: Sector; pattern: RegExp }[] = [
  { sector: 'restaurant', pattern: /\b(coffee|roaster|roastery|cafe|café|bakery|bistro|restaurant|diner|kitchen|barista)\b/i },
  { sector: 'hospitality', pattern: /\b(hotel|inn|hostel|lodging|resort|hospitality|bed and breakfast)\b/i },
  { sector: 'saas', pattern: /\b(saas|software|platform|dashboard|subscription|b2b)\b/i },
  { sector: 'dev-tool', pattern: /\b(developer|devtool|api|sdk|cli|github|code editor)\b/i },
  { sector: 'ai-product', pattern: /\b(\bai\b|llm|machine learning|copilot|agent)\b/i },
  { sector: 'agency', pattern: /\b(agency|creative studio|design studio|marketing firm)\b/i },
  { sector: 'studio-portfolio', pattern: /\b(studio|portfolio|photographer|illustrator)\b/i },
  { sector: 'ecommerce', pattern: /\b(shop|store|ecommerce|e-commerce|retail|marketplace)\b/i },
  { sector: 'fashion', pattern: /\b(fashion|apparel|clothing|boutique|wear)\b/i },
  { sector: 'architecture', pattern: /\b(architecture|architect|building design)\b/i },
  { sector: 'real-estate', pattern: /\b(real estate|property|realtor|housing)\b/i },
  { sector: 'health', pattern: /\b(health|clinic|medical|wellness|therapy)\b/i },
  { sector: 'education', pattern: /\b(school|university|course|education|learning)\b/i },
  { sector: 'nonprofit', pattern: /\b(nonprofit|charity|foundation|ngo)\b/i },
  { sector: 'music', pattern: /\b(music|band|artist|record label|concert)\b/i },
  { sector: 'event', pattern: /\b(event|conference|festival|summit|wedding)\b/i },
  { sector: 'physical-product', pattern: /\b(product|hardware|gadget|furniture|craft)\b/i },
  { sector: 'consumer-app', pattern: /\b(app|mobile|ios|android|consumer)\b/i },
  { sector: 'finance', pattern: /\b(finance|bank|invest|fintech|crypto)\b/i },
  { sector: 'culture', pattern: /\b(museum|gallery|culture|theatre|theater)\b/i },
]

export function inferSector(brief: string): Sector {
  const trimmed = brief.trim()
  for (const { sector, pattern } of RULES) {
    if (pattern.test(trimmed)) return sector
  }
  return 'other'
}

export function briefTitle(brief: string): string {
  const words = brief
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
  if (!words.length) return 'Your project'
  const title = words.join(' ')
  return title.charAt(0).toUpperCase() + title.slice(1)
}
