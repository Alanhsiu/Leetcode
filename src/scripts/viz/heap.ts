// Binary min-heap — push with sift-up, then pop-min with sift-down.
import { createViz, type Step } from "./base.ts";
import { cell, line, circle, text, C } from "./svg.ts";

interface S extends Step {
  heap: number[];
  active: number | null; // index being sifted
  compare: number | null; // parent/child being compared
}

export default function heap(container: HTMLElement) {
  const pushes = [5, 3, 8, 1, 2];
  const steps: S[] = [];
  const h: number[] = [];

  const snap = (caption: string, active: number | null, compare: number | null) =>
    steps.push({ caption, heap: [...h], active, compare });

  snap("Empty min-heap. We'll push 5, 3, 8, 1, 2, then pop the minimum.", null, null);

  // ---- Pushes with sift-up ----
  for (const v of pushes) {
    h.push(v);
    let i = h.length - 1;
    snap(`Push ${v}: append at index ${i}, then sift up.`, i, null);
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (h[i] < h[parent]) {
        snap(`Compare ${h[i]} (idx ${i}) with parent ${h[parent]} (idx ${parent}): ${h[i]} < ${h[parent]} → swap.`, i, parent);
        [h[i], h[parent]] = [h[parent], h[i]];
        snap(`Swapped. ${h[parent]} is now at index ${i}; continue sifting from ${parent}.`, parent, null);
        i = parent;
      } else {
        snap(`Compare ${h[i]} (idx ${i}) with parent ${h[parent]} (idx ${parent}): ${h[i]} ≥ ${h[parent]} → stop.`, i, parent);
        break;
      }
    }
    if (i === 0) snap(`${h[0]} reached the root; heap property restored.`, 0, null);
  }

  // ---- Pop-min with sift-down ----
  const min = h[0];
  const last = h[h.length - 1];
  h[0] = last;
  h.pop();
  snap(`Pop min (${min}): move last element ${last} to the root, then sift down.`, 0, null);
  let i = 0;
  const n = h.length;
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let smallest = i;
    if (l < n && h[l] < h[smallest]) smallest = l;
    if (r < n && h[r] < h[smallest]) smallest = r;
    if (smallest === i) {
      snap(`Node ${h[i]} (idx ${i}) ≤ its children → heap property restored.`, i, null);
      break;
    }
    snap(`Compare ${h[i]} (idx ${i}) with smaller child ${h[smallest]} (idx ${smallest}): swap down.`, i, smallest);
    [h[i], h[smallest]] = [h[smallest], h[i]];
    snap(`Swapped. ${h[i]} now at index ${i}; continue sifting from ${smallest}.`, smallest, null);
    i = smallest;
  }

  snap(`Done. Min-heap after pop: [${h.join(", ")}] (root ${h[0]} is the new minimum).`, null, null);

  // ---- Layout ----
  const R = 20;
  const depthOf = (idx: number) => Math.floor(Math.log2(idx + 1));
  const rowY = (d: number) => 60 + d * 75;
  // x by index: spread within its depth row across the width.
  const posX = (idx: number) => {
    const d = depthOf(idx);
    const first = (1 << d) - 1; // first index at depth d
    const countAtDepth = 1 << d;
    const posInRow = idx - first;
    const slot = 560 / (countAtDepth + 1);
    return slot * (posInRow + 1);
  };

  const cellW = 40, cellH = 36, gap = 4;
  const arrY = 270;

  createViz<S>(container, {
    width: 560,
    height: 330,
    steps,
    label: "Binary min-heap push and pop",
    draw(layer, s) {
      const arr = s.heap;
      // Tree edges first.
      for (let idx = 0; idx < arr.length; idx++) {
        const parent = (idx - 1) >> 1;
        if (idx > 0) {
          layer.append(line(posX(parent), rowY(depthOf(parent)), posX(idx), rowY(depthOf(idx)), { stroke: C.stroke, width: 2 }));
        }
      }
      // Tree nodes on top.
      for (let idx = 0; idx < arr.length; idx++) {
        const x = posX(idx);
        const y = rowY(depthOf(idx));
        const isActive = idx === s.active;
        const isCompare = idx === s.compare;
        const fill = isActive ? C.active : isCompare ? C.compare : C.cell;
        const textFill = isActive || isCompare ? C.textOn : C.text;
        layer.append(circle(x, y, R, { fill, stroke: C.stroke, width: 2 }));
        layer.append(text(x, y, String(arr[idx]), { size: 15, weight: 700, fill: textFill, mono: true }));
        layer.append(text(x, y - R - 9, String(idx), { size: 9, fill: C.muted, mono: true }));
      }
      // Backing array row below.
      const totalW = arr.length * cellW + Math.max(0, arr.length - 1) * gap;
      const x0 = (560 - totalW) / 2;
      layer.append(text(x0 - 14, arrY + cellH / 2, "arr", { anchor: "end", size: 11, fill: C.muted }));
      for (let idx = 0; idx < arr.length; idx++) {
        const x = x0 + idx * (cellW + gap);
        const isActive = idx === s.active;
        const isCompare = idx === s.compare;
        const fill = isActive ? C.active : isCompare ? C.compare : C.cell;
        const textFill = isActive || isCompare ? C.textOn : C.text;
        layer.append(cell(x, arrY, cellW, cellH, String(arr[idx]), { fill, textFill, fontSize: 14 }));
        layer.append(text(x + cellW / 2, arrY + cellH + 11, String(idx), { size: 9, fill: C.muted, mono: true }));
      }
    },
  });
}
