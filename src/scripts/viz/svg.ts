// Tiny SVG element helpers shared by every visualization.
const NS = "http://www.w3.org/2000/svg";

type Attrs = Record<string, string | number>;

export function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: (SVGElement | string)[] = []
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  for (const c of children) node.append(typeof c === "string" ? document.createTextNode(c) : c);
  return node;
}

export function group(attrs: Attrs = {}, children: (SVGElement | string)[] = []) {
  return el("g", attrs, children);
}

/** A labelled rounded rectangle "cell" (array slot, DP cell, etc.). */
export function cell(
  x: number, y: number, w: number, h: number,
  label: string, opts: { fill?: string; stroke?: string; textFill?: string; fontSize?: number; rx?: number } = {}
) {
  const g = group();
  g.append(
    el("rect", {
      x, y, width: w, height: h, rx: opts.rx ?? 7,
      fill: opts.fill ?? "var(--viz-cell)",
      stroke: opts.stroke ?? "var(--viz-stroke)",
      "stroke-width": 1.5,
    })
  );
  g.append(
    el("text", {
      x: x + w / 2, y: y + h / 2,
      "text-anchor": "middle", "dominant-baseline": "central",
      "font-size": opts.fontSize ?? 16, "font-family": "var(--font-mono)", "font-weight": 600,
      fill: opts.textFill ?? "var(--viz-text)",
    }, [label])
  );
  return g;
}

export function text(
  x: number, y: number, str: string,
  opts: { anchor?: string; size?: number; fill?: string; weight?: number; mono?: boolean } = {}
) {
  return el("text", {
    x, y,
    "text-anchor": opts.anchor ?? "middle",
    "dominant-baseline": "central",
    "font-size": opts.size ?? 13,
    "font-family": opts.mono ? "var(--font-mono)" : "var(--font-sans)",
    "font-weight": opts.weight ?? 500,
    fill: opts.fill ?? "var(--viz-text)",
  }, [str]);
}

export function line(x1: number, y1: number, x2: number, y2: number, opts: { stroke?: string; width?: number; dash?: string } = {}) {
  const a: Attrs = { x1, y1, x2, y2, stroke: opts.stroke ?? "var(--viz-stroke)", "stroke-width": opts.width ?? 2 };
  if (opts.dash) a["stroke-dasharray"] = opts.dash;
  return el("line", a);
}

export function circle(cx: number, cy: number, r: number, opts: { fill?: string; stroke?: string; width?: number } = {}) {
  return el("circle", {
    cx, cy, r,
    fill: opts.fill ?? "var(--viz-cell)",
    stroke: opts.stroke ?? "var(--viz-stroke)",
    "stroke-width": opts.width ?? 1.5,
  });
}

/** Palette tokens (CSS vars defined in global.css under .viz-stage). */
export const C = {
  cell: "var(--viz-cell)",
  active: "var(--viz-active)",
  done: "var(--viz-done)",
  compare: "var(--viz-compare)",
  visited: "var(--viz-visited)",
  highlight: "var(--viz-highlight)",
  muted: "var(--viz-muted)",
  text: "var(--viz-text)",
  textOn: "var(--viz-text-on)",
  stroke: "var(--viz-stroke)",
};
