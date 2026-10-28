export const SECTORS = [
  "saas",
  "dev-tool",
  "ai-product",
  "consumer-app",
  "finance",
  "agency",
  "studio-portfolio",
  "personal-portfolio",
  "ecommerce",
  "physical-product",
  "fashion",
  "hospitality",
  "restaurant",
  "real-estate",
  "architecture",
  "event",
  "health",
  "education",
  "nonprofit",
  "culture",
  "music",
  "other",
] as const;

export type Sector = (typeof SECTORS)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  saas: "SaaS",
  "dev-tool": "Dev tool",
  "ai-product": "AI product",
  "consumer-app": "Consumer app",
  finance: "Finance",
  agency: "Agency",
  "studio-portfolio": "Studio portfolio",
  "personal-portfolio": "Personal portfolio",
  ecommerce: "Ecommerce",
  "physical-product": "Physical product",
  fashion: "Fashion",
  hospitality: "Hospitality",
  restaurant: "Restaurant",
  "real-estate": "Real estate",
  architecture: "Architecture",
  event: "Event",
  health: "Health",
  education: "Education",
  nonprofit: "Nonprofit",
  culture: "Culture",
  music: "Music",
  other: "Other",
};

const RULES: { test: RegExp; sector: Sector }[] = [
  { test: /\b(coffee|cafe|café|roaster|bakery|restaurant|bistro|diner|kitchen|menu|chef)\b/i, sector: "restaurant" },
  { test: /\b(hotel|hostel|lodging|resort|airbnb)\b/i, sector: "hospitality" },
  { test: /\b(saas|b2b)\b/i, sector: "saas" },
  { test: /\b(devtool|dev tool|developer tool|cli|sdk)\b/i, sector: "dev-tool" },
  { test: /\b(ai|llm|machine learning)\b/i, sector: "ai-product" },
  { test: /\b(fintech|bank|invoice|ledger|payment)\b/i, sector: "finance" },
  { test: /\b(shop|store|ecommerce|e-commerce)\b/i, sector: "ecommerce" },
  { test: /\b(fashion|clothing|apparel|lookbook)\b/i, sector: "fashion" },
  { test: /\b(architect|architecture)\b/i, sector: "architecture" },
  { test: /\b(real estate|realtor|apartment)\b/i, sector: "real-estate" },
  { test: /\b(agency)\b/i, sector: "agency" },
  { test: /\b(studio)\b/i, sector: "studio-portfolio" },
  { test: /\b(portfolio)\b/i, sector: "personal-portfolio" },
  { test: /\b(music|album|band)\b/i, sector: "music" },
  { test: /\b(museum|gallery|magazine)\b/i, sector: "culture" },
  { test: /\b(event|festival|conference|wedding)\b/i, sector: "event" },
  { test: /\b(clinic|health|dental|wellness)\b/i, sector: "health" },
  { test: /\b(school|course|university|education)\b/i, sector: "education" },
  { test: /\b(nonprofit|charity|foundation)\b/i, sector: "nonprofit" },
  { test: /\b(furniture|ceramic|object)\b/i, sector: "physical-product" },
  { test: /\b(app)\b/i, sector: "consumer-app" },
];

export function isSector(value: string): value is Sector {
  return (SECTORS as readonly string[]).includes(value);
}

export function inferSector(brief: string): Sector {
  for (const rule of RULES) {
    if (rule.test.test(brief)) return rule.sector;
  }
  return "other";
}
