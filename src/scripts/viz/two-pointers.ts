// Two Pointers — Two Sum II on a sorted array. Converging pointers.
import { createViz, type Step } from "./base.ts";
import { cell, text, C } from "./svg.ts";

interface S extends Step { l: number; r: number; sum: number | null; found: boolean; }

export default function twoPointers(container: HTMLElement) {
  const arr = [1, 3, 4, 6, 8, 11, 15];
  const target = 14;
  const steps: S[] = [];
  let l = 0, r = arr.length - 1;

  steps.push({ caption: `Sorted array, target = ${target}. Start a pointer at each end.`, l, r, sum: null, found: false });
  while (l < r) {
    const sum = arr[l] + arr[r];
    if (sum === target) {
      steps.push({ caption: `arr[${l}] + arr[${r}] = ${arr[l]} + ${arr[r]} = ${sum} = target ✓ Found it!`, l, r, sum, found: true });
      break;
    } else if (sum < target) {
      steps.push({ caption: `${arr[l]} + ${arr[r]} = ${sum} < ${target}. Too small → move left pointer right.`, l, r, sum, found: false });
      l++;
    } else {
      steps.push({ caption: `${arr[l]} + ${arr[r]} = ${sum} > ${target}. Too big → move right pointer left.`, l, r, sum, found: false });
      r--;
    }
  }

  const W = 60, H = 60, GAP = 8;
  const totalW = arr.length * W + (arr.length - 1) * GAP;
  const x0 = (520 - totalW) / 2;
  const y = 70;

  createViz<S>(container, {
    width: 520, height: 200, steps, label: "Two pointers converging on a sorted array",
    draw(layer, s) {
      for (let i = 0; i < arr.length; i++) {
        const x = x0 + i * (W + GAP);
        const isL = i === s.l, isR = i === s.r;
        const active = isL || isR;
        const fill = s.found && active ? C.done : active ? C.active : C.cell;
        const tf = active ? C.textOn : C.text;
        layer.append(cell(x, y, W, H, String(arr[i]), { fill, textFill: tf }));
        layer.append(text(x + W / 2, y - 14, String(i), { size: 11, fill: C.muted, mono: true }));
        if (isL) layer.append(text(x + W / 2, y + H + 20, "L", { size: 14, fill: C.active, weight: 700 }));
        if (isR) layer.append(text(x + W / 2, y + H + 20, "R", { size: 14, fill: C.active, weight: 700 }));
      }
      layer.append(text(260, 28, `target = ${target}` + (s.sum !== null ? `   ·   sum = ${s.sum}` : ""), { size: 15, weight: 700 }));
    },
  });
}
