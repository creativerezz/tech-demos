export type Direction = {
  id: string;
  name: string;
  sectors: string[];
  tones?: string[];
  needs?: string[];
  needsPictures?: boolean;
  idea: string;
  composition: string;
  typography?: string;
  typeClasses?: string[];
  type?: string[];
  colour?: string;
  paletteTags?: string[];
  palettes?: string[];
  heroes?: string[];
  imagery?: string;
  pitfalls?: string;
  richness?: string;
  allow?: string[];
};

export type Hero = {
  id: string;
  name: string;
  archetype: string;
  directions?: string[];
  tags?: string[];
  needs?: string[];
  blueprint: string;
  mobile: string;
  headline?: string;
};

export type FontRole = {
  family: string;
  weights?: number[];
  italic?: boolean;
  settings: string;
  css?: string;
};

export type TypeSystem = {
  id: string;
  name: string;
  class: string;
  display: FontRole;
  text: FontRole;
  note?: string;
  scale?: Record<string, string>;
};

export type PaletteField = {
  bg: string;
  ink?: string;
};

export type Palette = {
  id: string;
  name: string;
  tags?: string[];
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accentInk: string;
  fields?: PaletteField[];
  note?: string;
};

export type DealtCard = {
  direction: Direction;
  hero: Hero;
  type: TypeSystem;
  palette: Palette;
};
