import { DirectionCard } from '@/components/DirectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { buildDesignSnippet } from '@/lib/taste/design-md'
import { dealThreeDirections } from '@/lib/taste/draw'
import { briefTitle, inferSector } from '@/lib/taste/sector'
import type { DealtDirection } from '@/lib/taste/types'
import { Check, Copy, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

const EXAMPLE_BRIEF = 'neighborhood coffee roaster'

export default function App() {
  const [brief, setBrief] = useState(EXAMPLE_BRIEF)
  const [dealt, setDealt] = useState<DealtDirection[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const sector = useMemo(() => inferSector(brief), [brief])
  const selected = dealt.find((d) => d.direction.id === selectedId) ?? null

  const snippet = useMemo(() => {
    if (!selected) return ''
    return buildDesignSnippet(selected, { brief, sector, tone: null, have: [], avoid: [] })
  }, [selected, brief, sector])

  function handleDeal() {
    const trimmed = brief.trim()
    if (!trimmed) return
    const cards = dealThreeDirections({
      brief: trimmed,
      sector: inferSector(trimmed),
      tone: null,
      have: [],
      avoid: [],
    })
    setDealt(cards)
    setSelectedId(cards[0]?.direction.id ?? null)
    setCopied(false)
  }

  async function handleCopy() {
    if (!snippet) return
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Taste Skill v2 demo</Badge>
          <Badge variant="secondary">Deterministic deal · no LLM</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Taste Direction Deck</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Type a one-line brief, deal three researched art directions from the{' '}
          <a
            className="underline underline-offset-2"
            href="https://github.com/Leonxlnx/taste-skill"
            target="_blank"
            rel="noreferrer"
          >
            Taste Skill
          </a>{' '}
          library, preview palette · type · hero, then copy a <code className="text-xs">DESIGN.md</code> snippet for
          your coding agent.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brief</CardTitle>
          <CardDescription>Example: &quot;{EXAMPLE_BRIEF}&quot; → sector inferred as restaurant.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={2}
            className="min-h-[72px] flex-1 resize-none text-base"
            placeholder="Describe the project in one line…"
          />
          <Button type="button" onClick={handleDeal} className="shrink-0 gap-2" disabled={!brief.trim()}>
            <Sparkles className="size-4" />
            Deal 3 directions
          </Button>
        </CardContent>
      </Card>

      {dealt.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              Dealt for <strong className="text-foreground">{briefTitle(brief)}</strong>
            </span>
            <Badge variant="outline">sector: {sector}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {dealt.map((d) => (
              <DirectionCard
                key={d.direction.id}
                dealt={d}
                brief={brief}
                selected={d.direction.id === selectedId}
                onSelect={() => {
                  setSelectedId(d.direction.id)
                  setCopied(false)
                }}
              />
            ))}
          </div>
        </section>
      )}

      {selected && (
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Agent handoff</CardTitle>
              <CardDescription>
                Selected: {selected.direction.name} · hero {selected.hero.name}
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Copied' : 'Copy DESIGN.md snippet'}
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[min(420px,50vh)] rounded-md border bg-muted/30 p-4">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{snippet}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <footer className="border-t pt-6 text-xs text-muted-foreground">
        Direction data vendored from{' '}
        <a className="underline" href="https://github.com/Leonxlnx/taste-skill" target="_blank" rel="noreferrer">
          Leonxlnx/taste-skill
        </a>{' '}
        (MIT). Homepage:{' '}
        <a className="underline" href="https://tasteskill.dev" target="_blank" rel="noreferrer">
          tasteskill.dev
        </a>
        .
      </footer>
    </div>
  )
}
