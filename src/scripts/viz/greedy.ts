// Jump Game — greedy reachability: track the farthest reachable index.
import { createViz, type Step } from "./base.ts";
import { cell, text, line, C } from "./svg.ts";

interface S extends Step {
  i: number;            // current index being examined (-1 before scan starts)
  farthest: number;     // farthest index reachable so far
  unreachable: boolean; // true once we hit an index beyond `farthest`
  done: boolean;        // true on the final summary step
}

export default function greedy(container: HTMLElement) {
  const nums = [2, 3, 1, 1, 4];
  const n = nums.length;
  const steps: S[] = [];

  let farthest = 0;
  let unreachable = false;

  steps.push({
    caption: `Jump Game: each value = max jump length. Start: farthest = 0 (can stand on index 0).`,
    i: -1, farthest, unreachable: false, done: false,
  });

  for (let i = 0; i < n; i++) {
    if (i > farthest) {
      unreachable = true;
      steps.push({
        caption: `i = ${i} > farthest = ${farthest}: index ${i} is unreachable. Stop — cannot proceed.`,
        i, farthest, unreachable: true, done: false,
      });
      break;
    }
    const reach = i + nums[i];
    const newFarthest = Math.max(farthest, reach);
    steps.push({
      caption: `i = ${i}: reachable. farthest = max(${farthest}, ${i} + nums[${i}]=${nums[i]} = ${reach}) = ${newFarthest}.`,
      i, farthest: newFarthest, unreachable: false, done: false,
    });
    farthest = newFarthest;
  }

  if (!unreachable) {
    steps.push({
      caption: `farthest = ${farthest} >= last index ${n - 1}: YES, the last index is reachable.`,
      i: n - 1, farthest, unreachable: false, done: true,
    });
  }

  const W = 64, H = 56, GAP = 10;
  const totalW = n * W + (n - 1) * GAP;
  const x0 = (560 - totalW) / 2;
  const y = 95;

  createViz<S>(container, {
    width: 560, height: 230, steps, label: "Jump Game greedy reachability",
    draw(layer, s) {
      const clampedFar = Math.min(s.farthest, n - 1);
      for (let i = 0; i < n; i++) {
        const x = x0 + i * (W + GAP);
        const reachable = i <= clampedFar;
        const isCurrent = i === s.i;
        let fill = C.cell;
        let textFill = C.muted;
        if (isCurrent && s.unreachable) { fill = C.compare; textFill = C.textOn; }
        else if (isCurrent) { fill = C.active; textFill = C.textOn; }
        else if (reachable) { fill = C.visited; textFill = C.textOn; }
        const g = cell(x, y, W, H, String(nums[i]), { fill, textFill });
        layer.append(g);
        layer.append(text(x + W / 2, y - 14, String(i), { size: 11, fill: C.muted, mono: true }));
        if (i === s.i && !s.unreachable) layer.append(text(x + W / 2, y + H + 18, "i", { size: 13, fill: C.active, weight: 700 }));
        if (i === s.i && s.unreachable) layer.append(text(x + W / 2, y + H + 18, "i ✗", { size: 13, fill: C.compare, weight: 700 }));
      }

      // Bracket / marker beneath the cells spanning the reachable prefix.
      const bx0 = x0;
      const bx1 = x0 + clampedFar * (W + GAP) + W;
      const by = y + H + 38;
      layer.append(line(bx0, by, bx1, by, { stroke: C.highlight, width: 3 }));
      layer.append(line(bx0, by - 6, bx0, by, { stroke: C.highlight, width: 3 }));
      layer.append(line(bx1, by - 6, bx1, by, { stroke: C.highlight, width: 3 }));
      layer.append(text((bx0 + bx1) / 2, by + 14, `reachable: indices 0..${clampedFar}`, { size: 12, fill: C.highlight, weight: 700 }));

      const title = s.done ? "Reachable ✓" : s.unreachable ? "Unreachable ✗" : `farthest = ${s.farthest}`;
      layer.append(text(280, 36, title, { size: 16, weight: 700, fill: s.unreachable ? C.compare : C.text }));
    },
  });
}
