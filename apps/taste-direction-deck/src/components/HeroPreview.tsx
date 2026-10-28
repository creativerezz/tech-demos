import { fontStylesheetHref } from '@/lib/taste/fonts'
import type { DealtDirection } from '@/lib/taste/types'
import { briefTitle } from '@/lib/taste/sector'
import { useEffect } from 'react'

type HeroPreviewProps = {
  dealt: DealtDirection
  brief: string
  compact?: boolean
}

export function HeroPreview({ dealt, brief, compact }: HeroPreviewProps) {
  const { palette: c, type, hero } = dealt
  const title = briefTitle(brief)
  const href = fontStylesheetHref(type.display.css ?? type.text.css)

  useEffect(() => {
    if (!href) return
    const id = `font-${dealt.seed}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [href, dealt.seed])

  const displayFamily = type.display.family
  const archetype = hero.archetype

  const baseStyle = {
    background: c.bg,
    color: c.ink,
    fontFamily: `"${displayFamily}", system-ui, sans-serif`,
  } as const

  if (archetype === 'giant-wordmark' || dealt.direction.id === 'name-as-monument') {
    return (
      <div
        className={`relative overflow-hidden rounded-md border ${compact ? 'h-36' : 'h-44'}`}
        style={baseStyle}
      >
        <div
          className="absolute inset-x-0 bottom-0 px-2 leading-none tracking-tight"
          style={{ fontSize: compact ? '1.35rem' : '1.65rem', fontWeight: 700, lineHeight: 0.85 }}
        >
          {title}
        </div>
        <p className="absolute right-2 top-2 max-w-[55%] text-right text-[9px]" style={{ color: c.muted }}>
          {brief.slice(0, 48) || 'Monument name hero'}
        </p>
      </div>
    )
  }

  if (archetype === 'type-poster') {
    const words = title.split(/\s+/)
    const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ') || title
    const line2 = words.slice(Math.ceil(words.length / 2)).join(' ') || 'Studio'
    return (
      <div
        className={`flex flex-col justify-between overflow-hidden rounded-md border p-3 ${compact ? 'h-36' : 'h-44'}`}
        style={{ ...baseStyle, background: c.accent, color: c.accentInk }}
      >
        <div className="text-[9px] uppercase tracking-widest opacity-80">Preview</div>
        <div className="leading-none tracking-tight" style={{ fontWeight: 700, fontSize: compact ? '1.1rem' : '1.35rem' }}>
          <div style={{ color: c.bg }}>{line1}</div>
          <div style={{ color: c.ink }}>{line2}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col justify-end overflow-hidden rounded-md border p-3 ${compact ? 'h-36' : 'h-44'}`}
      style={baseStyle}
    >
      <div className="mb-auto flex gap-1 pt-1">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.accent }} />
        <span className="h-1.5 w-1.5 rounded-full opacity-40" style={{ background: c.muted }} />
      </div>
      <h3 className="text-sm font-semibold leading-tight tracking-tight">{title}</h3>
      <p className="mt-1 line-clamp-2 text-[10px]" style={{ color: c.muted }}>
        {hero.name}
      </p>
      <button
        type="button"
        className="mt-2 w-fit rounded px-2 py-0.5 text-[10px] font-medium"
        style={{ background: c.accent, color: c.accentInk }}
      >
        Primary action
      </button>
    </div>
  )
}
