export function titleCaseBrief(brief: string): string {
  const cleaned = brief.trim().replace(/\s+/g, " ");
  if (!cleaned) return "Untitled";
  return cleaned.replace(/\p{L}+/gu, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

export function monumentWords(title: string): string {
  const words = title.split(" ");
  if (title.length <= 18 || words.length < 2) return title;
  return words.slice(-2).join(" ");
}

export function splitLines(title: string): [string, string] {
  const words = title.split(" ").filter(Boolean);
  if (words.length < 2) return [title, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function openingSentences(text: string, count: number): string {
  const parts = text.split(/(?<=\.)\s+/).filter(Boolean);
  if (!parts.length) return text;
  return parts.slice(0, count).join(" ");
}
