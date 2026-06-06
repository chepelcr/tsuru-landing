// Rich text — turns a simple, nestable token syntax into React nodes (never an
// HTML string), so it is XSS-safe by construction (no dangerouslySetInnerHTML).
//
// Tokens (they nest, so styles combine):
//   \n        line break (<br/>)
//   {{text}}  brand gradient highlight
//   [[text]]  accent colour A
//   ((text))  accent colour B
//   <<text>>  accent colour C
//   **text**  bold
//
// Highlight colours use semantic Tailwind tokens so they track the active theme.

import { Fragment, type ReactNode } from "react";

type Style = "gradient" | "accentA" | "accentB" | "accentC" | "bold";

const STYLE_CLASS: Record<Style, string> = {
  gradient: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent",
  accentA: "text-accent",
  accentB: "text-secondary",
  accentC: "text-primary",
  bold: "font-bold",
};

const PATTERNS: Array<{ regex: RegExp; style: Style }> = [
  { regex: /\{\{([\s\S]+?)\}\}/, style: "gradient" },
  { regex: /\[\[([\s\S]+?)\]\]/, style: "accentA" },
  { regex: /\(\(([\s\S]+?)\)\)/, style: "accentB" },
  { regex: /<<([\s\S]+?)>>/, style: "accentC" },
  { regex: /\*\*([\s\S]+?)\*\*/, style: "bold" },
];

function renderLine(line: string, keyPrefix: string): ReactNode[] {
  let best: { index: number; length: number; text: string; style: Style } | null = null;
  for (const { regex, style } of PATTERNS) {
    const m = regex.exec(line);
    if (m && (best === null || m.index < best.index))
      best = { index: m.index, length: m[0].length, text: m[1], style };
  }
  if (!best) return line ? [line] : [];
  const out: ReactNode[] = [];
  if (best.index > 0) out.push(line.slice(0, best.index));
  out.push(
    <span key={keyPrefix} className={STYLE_CLASS[best.style]}>
      {renderLine(best.text, `${keyPrefix}i`)}
    </span>,
  );
  const rest = line.slice(best.index + best.length);
  if (rest) out.push(...renderLine(rest, `${keyPrefix}r`));
  return out;
}

export function parseRichText(value: string): ReactNode {
  if (!value) return value;
  return value.split("\\n").map((line, i, arr) => (
    <Fragment key={i}>
      {renderLine(line, String(i))}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}

export function RichText({ children }: { children: string }) {
  return <>{parseRichText(children)}</>;
}

export const RICH_TEXT_HINT =
  "Format: \\n line break · {{gradient}} · [[A]] · ((B)) · <<C>> · **bold** · they combine: [[**A and bold**]]";
