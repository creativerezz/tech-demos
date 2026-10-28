import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import { openingSentences } from "./copy.ts";
import { deal, seedFor } from "./dealer.ts";
import { fontHrefs } from "./fonts.ts";
import { HeroPreview } from "./HeroPreview.tsx";
import { inferSector, isSector, SECTOR_LABELS, SECTORS, type Sector } from "./sector.ts";
import { designMarkdown } from "./snippet.ts";
import type { DealtCard, Palette } from "./types.ts";

type DealResult = {
  cards: DealtCard[];
  seed: number;
  attempt: number;
  brief: string;
  sector: Sector;
};

const SWATCHES: { key: keyof Pick<Palette, "bg" | "surface" | "ink" | "accent">; label: string }[] = [
  { key: "bg", label: "Ground" },
  { key: "surface", label: "Surface" },
  { key: "ink", label: "Ink" },
  { key: "accent", label: "Accent" },
];

function useDealtFonts(cards: DealtCard[] | null) {
  const hrefs = useMemo(() => fontHrefs(cards?.map((card) => card.type) ?? []), [cards]);
  useEffect(() => {
    const links = hrefs.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.tasteFont = "1";
      document.head.append(link);
      return link;
    });
    return () => {
      for (const link of links) link.remove();
    };
  }, [hrefs]);
}

export function DeckScreen() {
  const [brief, setBrief] = useState("");
  const [sectorOverride, setSectorOverride] = useState<Sector | null>(null);
  const sector = sectorOverride ?? inferSector(brief);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DealResult | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  useDealtFonts(result?.cards ?? null);

  const picked = result?.cards.find((card) => card.direction.id === pickedId) ?? null;
  const snippet = picked && result ? designMarkdown(picked, result.brief, result.sector, result.seed) : "";

  useEffect(() => {
    if (!picked) return;
    document.getElementById("design-snippet")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [picked]);

  function runDeal(attempt: number) {
    const trimmed = brief.trim();
    if (!trimmed) {
      setError("Write a short brief first.");
      return;
    }
    const seed = seedFor(trimmed, sector, attempt);
    setError(null);
    setCopied(false);
    setCopyError(null);
    setPickedId(null);
    setResult({
      cards: deal({ brief: trimmed, sector, have: [], avoid: [], tone: null }, seed),
      seed,
      attempt,
      brief: trimmed,
      sector,
    });
  }

  async function copySnippet() {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setCopyError(null);
    } catch {
      setCopied(false);
      setCopyError("The browser blocked clipboard access. Select the snippet and copy it from there.");
    }
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-8 px-5 py-8 text-sm">
      <header className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Taste Skill v2</p>
        <h1 className="text-2xl font-medium tracking-tight">Deal three directions</h1>
        <p className="max-w-2xl text-muted-foreground">
          Type a short brief. The deck deals three researched art directions, then previews each palette, type pairing,
          and hero on that brief. Pick one and copy a DESIGN.md snippet for your coding agent.
        </p>
      </header>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          runDeal(0);
        }}
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="flex flex-col gap-2">
            <label htmlFor="brief" className="text-xs">
              Brief
            </label>
            <Textarea
              id="brief"
              name="brief"
              value={brief}
              placeholder="neighborhood coffee roaster"
              aria-invalid={error ? true : undefined}
              className="min-h-24 text-sm"
              onChange={(event) => {
                setBrief(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="sector" className="text-xs">
              Sector
            </label>
            <select
              id="sector"
              name="sector"
              value={sector}
              className="h-8 rounded-none border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              onChange={(event) => {
                const next = event.target.value;
                if (isSector(next)) setSectorOverride(next);
              }}
            >
              {SECTORS.map((item) => (
                <option key={item} value={item}>
                  {SECTOR_LABELS[item]}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {sectorOverride ? "Chosen by you." : "Suggested from the brief. Change it if the guess is wrong."}
            </p>
          </div>
        </div>
        {error ? (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
        <div>
          <Button type="submit" size="lg" className="px-4 text-sm">
            Deal three directions
          </Button>
        </div>
      </form>

      {result ? (
        <section className="flex flex-col gap-4" aria-label="Dealt directions">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {SECTOR_LABELS[result.sector]} · seed {result.seed}
              {result.attempt > 0 ? ` · deal ${result.attempt + 1}` : ""}
            </p>
            <Button type="button" variant="outline" onClick={() => runDeal(result.attempt + 1)}>
              Deal again
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {result.cards.map((card) => {
              const selected = card.direction.id === pickedId;
              return (
                <Card key={card.direction.id} className={cn("pt-0", selected && "ring-2 ring-foreground")}>
                  <HeroPreview
                    archetype={card.hero.archetype}
                    palette={card.palette}
                    type={card.type}
                    brief={result.brief}
                    heroName={card.hero.name}
                  />
                  <CardHeader>
                    <CardTitle className="text-base">{card.direction.name}</CardTitle>
                    <CardDescription className="line-clamp-4 text-sm text-foreground/80">
                      {openingSentences(card.direction.idea, 1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{card.hero.name}</Badge>
                      <Badge variant="secondary">{card.palette.name}</Badge>
                    </div>
                    <p className="text-xs">
                      Display {card.type.display.family}
                      <span className="text-muted-foreground"> · </span>
                      Text {card.type.text.family}
                    </p>
                    <ul className="flex gap-1" aria-label={`${card.palette.name} palette`}>
                      {SWATCHES.map((swatch) => (
                        <li key={swatch.key} title={`${swatch.label} ${card.palette[swatch.key]}`}>
                          <span
                            className="block size-6 border border-foreground/15"
                            style={{ background: card.palette[swatch.key] }}
                          />
                          <span className="sr-only">
                            {swatch.label} {card.palette[swatch.key]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      variant={selected ? "default" : "outline"}
                      className="w-full"
                      aria-pressed={selected}
                      onClick={() => {
                        setPickedId(card.direction.id);
                        setCopied(false);
                        setCopyError(null);
                        setError(null);
                      }}
                    >
                      {selected ? "Selected" : "Use this direction"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      ) : (
        <p className="text-xs text-muted-foreground">The three cards land here after you deal.</p>
      )}

      {picked && result ? (
        <section id="design-snippet" className="flex scroll-mt-6 flex-col gap-3" aria-label="DESIGN.md snippet">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-medium">DESIGN.md · {picked.direction.name}</h2>
            <Button type="button" size="lg" className="px-4 text-sm" onClick={() => void copySnippet()}>
              {copied ? "Copied" : "Copy snippet"}
            </Button>
          </div>
          {copied || copyError ? (
            <p role="status" className="text-xs">
              {copied ? "Copied to the clipboard." : copyError}
            </p>
          ) : null}
          <pre className="max-h-96 overflow-auto border border-border bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap">
            {snippet}
          </pre>
        </section>
      ) : null}

      <footer className="mt-auto flex flex-col gap-1 border-t border-border pt-4 text-xs text-muted-foreground">
        <p>
          Directions, palettes, type, and hero blueprints are from{" "}
          <a className="underline" href="https://github.com/Leonxlnx/taste-skill" target="_blank" rel="noreferrer">
            Taste Skill v2
          </a>{" "}
          by Leonxlnx, MIT License, commit 12af471. Homepage{" "}
          <a className="underline" href="https://tasteskill.dev" target="_blank" rel="noreferrer">
            tasteskill.dev
          </a>
          .
        </p>
        <p>The deal is deterministic: the same brief, sector, and deal number always return the same three cards. No model is called.</p>
      </footer>
    </main>
  );
}
