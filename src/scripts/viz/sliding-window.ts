// Sliding Window — longest substring without repeating characters.
import { createViz, type Step } from "./base.ts";
import { cell, text, C } from "./svg.ts";

interface S extends Step { l: number; r: number; best: number; bestL: number; }

export default function slidingWindow(container: HTMLElement) {
  const str = "abcabcbb";
  const steps: S[] = [];
  const seen = new Map<string, number>();
  let l = 0, best = 0, bestL = 0;
  steps.push({ caption: `Find the longest window with all-unique characters in "${str}".`, l: 0, r: -1, best, bestL });
  for (let r = 0; r < str.length; r++) {
    const ch = str[r];
    if (seen.has(ch) && seen.get(ch)! >= l) {
      const old = l;
      l = seen.get(ch)! + 1;
      steps.push({ caption: `'${ch}' repeats — shrink window: move left from ${old} to ${l}.`, l, r, best, bestL });
    }
    seen.set(ch, r);
    const len = r - l + 1;
    if (len > best) { best = len; bestL = l; }
    steps.push({ caption: `Expand right to '${ch}'. Window "${str.slice(l, r + 1)}" length ${len}. Best so far ${best}.`, l, r, best, bestL });
  }
  steps.push({ caption: `Done. Longest unique substring = "${str.slice(bestL, bestL + best)}" (length ${best}).`, l: bestL, r: bestL + best - 1, best, bestL });

  const W = 52, H = 56, GAP = 8;
  const totalW = str.length * W + (str.length - 1) * GAP;
  const x0 = (540 - totalW) / 2;
  const y = 80;

  createViz<S>(container, {
    width: 540, height: 190, steps, label: "Sliding window over a string",
    draw(layer, s) {
      for (let i = 0; i < str.length; i++) {
        const x = x0 + i * (W + GAP);
        const inWin = i >= s.l && i <= s.r;
        const fill = inWin ? C.active : C.cell;
        layer.append(cell(x, y, W, H, str[i], { fill, textFill: inWin ? C.textOn : C.text }));
        layer.append(text(x + W / 2, y - 12, String(i), { size: 10, fill: C.muted, mono: true }));
      }
      if (s.r >= s.l) {
        const x = x0 + s.l * (W + GAP);
        const w = (s.r - s.l + 1) * (W + GAP) - GAP;
        layer.append(text(x + w / 2, y + H + 20, `window (len ${s.r - s.l + 1})`, { size: 12, fill: C.active, weight: 700 }));
      }
      layer.append(text(270, 32, `best = ${s.best}`, { size: 15, weight: 700, fill: C.done }));
    },
  });
}
