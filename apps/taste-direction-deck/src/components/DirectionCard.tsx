import { HeroPreview } from '@/components/HeroPreview'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DealtDirection } from '@/lib/taste/types'
import { cn } from '@/lib/utils'

type DirectionCardProps = {
  dealt: DealtDirection
  brief: string
  selected: boolean
  onSelect: () => void
}

function ideaLead(idea: string): string {
  return idea.split(/(?<=\.)\s+/)[0] ?? idea
}

export function DirectionCard({ dealt, brief, selected, onSelect }: DirectionCardProps) {
  const { direction, palette, type } = dealt
  const swatches = [palette.bg, palette.surface, palette.ink, palette.accent]

  return (
    <button type="button" onClick={onSelect} className="w-full text-left">
      <Card
        className={cn(
          'h-full transition-shadow hover:shadow-md',
          selected && 'ring-2 ring-foreground ring-offset-2 ring-offset-background',
        )}
      >
        <CardHeader className="gap-2 pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{direction.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
              {direction.id}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 text-xs">{ideaLead(direction.idea)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <HeroPreview dealt={dealt} brief={brief} compact />
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">{type.name}</span>
            <div className="flex shrink-0 gap-0.5">
              {swatches.map((color) => (
                <span
                  key={color}
                  className="h-4 w-4 rounded-sm border border-border/60"
                  style={{ background: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
