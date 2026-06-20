// Binary Search — halve the search space each step.
import { createViz, type Step } from "./base.ts";
import { cell, text, C } from "./svg.ts";

interface S extends Step { lo: number; hi: number; mid: number | null; found: boolean; }

export default function binarySearch(container: HTMLElement) {
  const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = 23;
  const steps: S[] = [];
  let lo = 0, hi = arr.length - 1;
  steps.push({ caption: `Search for ${target} in a sorted array. lo = 0, hi = ${hi}.`, lo, hi, mid: null, found: false });
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) {
      steps.push({ caption: `mid = ${mid}, arr[mid] = ${arr[mid]} = target ✓ Found at index ${mid}.`, lo, hi, mid, found: true });
      break;
    } else if (arr[mid] < target) {
      steps.push({ caption: `mid = ${mid}, arr[mid] = ${arr[mid]} < ${target} → discard left half, lo = ${mid + 1}.`, lo, hi, mid, found: false });
      lo = mid + 1;
    } else {
      steps.push({ caption: `mid = ${mid}, arr[mid] = ${arr[mid]} > ${target} → discard right half, hi = ${mid - 1}.`, lo, hi, mid, found: false });
      hi = mid - 1;
    }
  }

  const W = 46, H = 50, GAP = 6;
  const totalW = arr.length * W + (arr.length - 1) * GAP;
  const x0 = (560 - totalW) / 2;
  const y = 75;

  createViz<S>(container, {
    width: 560, height: 190, steps, label: "Binary search halving the range",
    draw(layer, s) {
      for (let i = 0; i < arr.length; i++) {
        const x = x0 + i * (W + GAP);
        const inRange = i >= s.lo && i <= s.hi;
        const isMid = i === s.mid;
        const fill = isMid ? (s.found ? C.done : C.compare) : inRange ? C.active : C.cell;
        const op = inRange || isMid ? 1 : 0.3;
        const g = cell(x, y, W, H, String(arr[i]), { fill, textFill: inRange || isMid ? C.textOn : C.muted });
        g.setAttribute("opacity", String(op));
        layer.append(g);
        layer.append(text(x + W / 2, y - 12, String(i), { size: 10, fill: C.muted, mono: true }));
        if (isMid) layer.append(text(x + W / 2, y + H + 18, "mid", { size: 12, fill: C.compare, weight: 700 }));
        if (i === s.lo) layer.append(text(x + W / 2, y + H + 34, "lo", { size: 11, fill: C.active, weight: 700 }));
        if (i === s.hi) layer.append(text(x + W / 2, y + H + (s.lo === s.hi ? 48 : 34), "hi", { size: 11, fill: C.active, weight: 700 }));
      }
      layer.append(text(280, 30, `target = ${target}`, { size: 15, weight: 700 }));
    },
  });
}
