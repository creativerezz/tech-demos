import type { CSSProperties, ReactNode } from "react";
import { monumentWords, splitLines, titleCaseBrief } from "./copy.ts";
import { fontStack } from "./fonts.ts";
import type { FontRole, Palette, TypeSystem } from "./types.ts";

const ARCHETYPES = [
  "giant-wordmark",
  "type-poster",
  "pinned-stage",
  "inline-media-sentence",
  "colour-field",
  "split",
  "bottom-anchored-type",
  "fullbleed-media",
  "artefact",
  "quiet-column",
  "object-centre",
  "mosaic",
  "tiles",
  "index",
] as const;

type Archetype = (typeof ARCHETYPES)[number];

type StageProps = {
  archetype: Archetype;
  palette: Palette;
  display: CSSProperties;
  text: CSSProperties;
  title: string;
  line1: string;
  line2: string;
  brief: string;
  label: string;
};

function asArchetype(value: string): Archetype {
  if ((ARCHETYPES as readonly string[]).includes(value)) return value as Archetype;
  return "type-poster";
}

function luma(hex: string): number {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((channel) => channel + channel).join("") : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  if ([red, green, blue].some((channel) => Number.isNaN(channel))) return 0;
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function inkOn(background: string, palette: Palette): string {
  const ground = luma(background);
  const inkDistance = Math.abs(ground - luma(palette.ink));
  const paperDistance = Math.abs(ground - luma(palette.bg));
  return inkDistance >= paperDistance ? palette.ink : palette.bg;
}

function field(palette: Palette, index: number): string {
  return palette.fields?.[index]?.bg ?? (index === 0 ? palette.surface : palette.ink);
}

function roleStyle(role: FontRole, stack: string, size: number, tight: boolean): CSSProperties {
  return {
    fontFamily: stack,
    fontWeight: role.weights?.[0] ?? (tight ? 600 : 400),
    fontStyle: role.italic ? "italic" : "normal",
    fontSize: size,
    letterSpacing: tight ? "-0.045em" : "-0.011em",
    lineHeight: tight ? 0.88 : 1.35,
    margin: 0,
  };
}

function Frame({ background, color, label, children }: { background: string; color: string; label: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className="relative h-48 w-full overflow-hidden" style={{ background, color }}>
      {children}
    </div>
  );
}

function Stage(props: StageProps) {
  const { archetype, palette, display, text, title, line1, line2, brief, label } = props;
  const picture = field(palette, 0);
  const pictureInk = inkOn(picture, palette);
  const second = field(palette, 1);

  switch (archetype) {
    case "giant-wordmark":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div className="h-[56%]" style={{ background: picture }} />
          <div className="flex h-[44%] items-end px-3 pb-3">
            <p style={display}>{title}</p>
          </div>
        </Frame>
      );
    case "type-poster":
      return (
        <Frame background={palette.accent} color={palette.accentInk} label={label}>
          <div className="flex h-full flex-col justify-between p-4">
            <p style={display}>{line1}</p>
            <p style={{ ...display, color: palette.bg }}>{line2 || line1}</p>
          </div>
        </Frame>
      );
    case "pinned-stage":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <p className="absolute top-3 left-3" style={display}>{line1}</p>
          <div className="absolute top-1/2 left-1/2 h-16 w-24 -translate-x-1/2 -translate-y-1/2" style={{ background: picture }} />
          <p className="absolute right-3 bottom-3" style={display}>{line2 || line1}</p>
        </Frame>
      );
    case "inline-media-sentence":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div className="flex h-full items-center gap-2 px-3">
            <p className="shrink-0" style={{ ...display, fontSize: 22 }}>{line1}</p>
            <div className="h-10 w-16 shrink-0" style={{ background: picture }} />
            <p className="min-w-0" style={{ ...display, fontSize: 22 }}>{line2 || brief}</p>
          </div>
        </Frame>
      );
    case "colour-field":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div
            className="absolute top-1/2 -right-10 size-56 -translate-y-1/2 rounded-full"
            style={{ background: palette.accent }}
          />
          <div className="relative flex h-full max-w-[58%] flex-col justify-center gap-2 px-4">
            <p style={display}>{line1}</p>
            {line2 ? <p style={display}>{line2}</p> : null}
          </div>
        </Frame>
      );
    case "split":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div className="grid h-full grid-cols-[1.15fr_0.85fr]">
            <div style={{ background: picture }} />
            <div className="flex flex-col justify-end gap-2 p-3">
              <p style={{ ...display, fontSize: 26 }}>{title}</p>
              <p style={text}>{brief}</p>
            </div>
          </div>
        </Frame>
      );
    case "bottom-anchored-type":
      return (
        <Frame background={picture} color={pictureInk} label={label}>
          <p className="absolute top-4 left-3 max-w-[70%]" style={display}>{line1}</p>
          <p className="absolute right-3 bottom-3 left-[28%] text-right" style={display}>{line2 || line1}</p>
        </Frame>
      );
    case "fullbleed-media":
      return (
        <Frame background={picture} color={pictureInk} label={label}>
          <div className="absolute top-1/2 left-3 max-w-[62%] -translate-y-1/2">
            <p style={{ ...display, fontSize: 28 }}>{line1}</p>
            {line2 ? <p style={{ ...display, fontSize: 28 }}>{line2}</p> : null}
            <p className="mt-2" style={{ ...text, color: pictureInk }}>{brief}</p>
          </div>
          <div className="absolute right-3 bottom-3 flex gap-2">
            {[line1, line2 || brief].map((word, index) => (
              <div key={index} className="flex h-14 w-14 items-end p-1" style={{ background: palette.bg, color: palette.ink }}>
                <p style={{ ...text, fontSize: 10, lineHeight: 1.1 }}>{word}</p>
              </div>
            ))}
          </div>
        </Frame>
      );
    case "artefact":
      return (
        <Frame background={second} color={palette.ink} label={label}>
          <div
            className="absolute top-1/2 left-1/2 flex h-[78%] w-[46%] -translate-x-1/2 -translate-y-1/2 flex-col justify-between p-3"
            style={{ background: palette.bg }}
          >
            <p style={{ ...display, fontSize: 22 }}>{title}</p>
            <p style={text}>{brief}</p>
          </div>
        </Frame>
      );
    case "quiet-column":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div className="absolute top-8 left-[27%] w-[46%]">
            <p style={{ ...display, fontSize: 22 }}>{title}</p>
            <p className="mt-3" style={text}>{brief}</p>
          </div>
        </Frame>
      );
    case "object-centre":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-[60%]" style={{ background: picture }} />
          <p className="absolute right-0 bottom-4 left-0 text-center" style={text}>{title}</p>
        </Frame>
      );
    case "mosaic":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div className="grid h-full grid-cols-2">
            <div className="flex flex-col justify-end p-3">
              <p style={{ ...display, fontSize: 24 }}>{title}</p>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-1 p-1" style={{ background: palette.surface }}>
              {[picture, palette.accent, second, palette.ink].map((color, index) => (
                <div key={index} style={{ background: color }} />
              ))}
            </div>
          </div>
        </Frame>
      );
    case "tiles":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <div className="grid h-[76%] grid-cols-4 gap-1 p-2">
            {[picture, palette.accent, second, palette.surface, palette.ink, picture, palette.accent, second].map(
              (color, index) => (
                <div key={`${color}-${index}`} style={{ background: color }} />
              ),
            )}
          </div>
          <div className="flex h-[24%] items-center px-3" style={{ background: palette.surface }}>
            <p style={{ ...text, color: palette.ink }}>{title}</p>
          </div>
        </Frame>
      );
    case "index":
      return (
        <Frame background={palette.bg} color={palette.ink} label={label}>
          <ul className="flex h-full flex-col justify-center gap-2 px-4">
            {[title, brief, line1, line2 || palette.name].filter(Boolean).slice(0, 4).map((row) => (
              <li key={row} className="flex items-baseline justify-between gap-3" style={text}>
                <span>{row}</span>
                <span style={{ background: palette.accent, color: palette.accentInk }} className="px-1">
                  {palette.name.split(" ")[0]}
                </span>
              </li>
            ))}
          </ul>
        </Frame>
      );
    default: {
      const unknown: never = archetype;
      return unknown;
    }
  }
}

export function HeroPreview({
  archetype,
  palette,
  type,
  brief,
  heroName,
}: {
  archetype: string;
  palette: Palette;
  type: TypeSystem;
  brief: string;
  heroName: string;
}) {
  const title = titleCaseBrief(brief);
  const monument = monumentWords(title);
  const [line1, line2] = splitLines(monument);
  const displayStack = fontStack(type.display.family, type.class);
  const textStack = fontStack(type.text.family, type.class);
  return (
    <Stage
      archetype={asArchetype(archetype)}
      palette={palette}
      display={roleStyle(type.display, displayStack, 34, true)}
      text={roleStyle(type.text, textStack, 12, false)}
      title={monument}
      line1={line1}
      line2={line2}
      brief={brief.trim()}
      label={`Sample hero, ${heroName}, for ${brief.trim()}`}
    />
  );
}
