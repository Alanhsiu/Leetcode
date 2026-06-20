// Linked List — Reverse a singly linked list in place. Track prev / cur / next.
import { createViz, type Step } from "./base.ts";
import { cell, text, line, el, C } from "./svg.ts";

// arrows[i] = j means node i currently points to node j; -1 means null.
interface S extends Step {
  arrows: number[];
  prev: number;
  cur: number;
  next: number;
  head: number;
}

export default function linkedList(container: HTMLElement) {
  const vals = [1, 2, 3, 4, 5];
  const n = vals.length;
  const steps: S[] = [];

  // Initial forward list: 0->1->2->3->4->null
  const arrows = vals.map((_, i) => (i < n - 1 ? i + 1 : -1));
  let prev = -1;
  let cur = 0;
  let next = -1;
  let head = 0;

  const snap = (caption: string) =>
    steps.push({ caption, arrows: [...arrows], prev, cur, next, head });

  snap("Original list 1 → 2 → 3 → 4 → 5. prev = null, cur = head (node 1).");

  while (cur !== -1) {
    next = arrows[cur];
    snap(
      `Save next = ${next === -1 ? "null" : vals[next]} so we don't lose the rest of the list.`
    );
    arrows[cur] = prev;
    head = cur;
    snap(
      `Reverse the link: node ${vals[cur]}.next now points to ${prev === -1 ? "null" : vals[prev]}.`
    );
    prev = cur;
    cur = next;
    snap(
      cur === -1
        ? `Advance: cur = null. Done — prev (node ${vals[prev]}) is the new head.`
        : `Advance: prev = node ${vals[prev]}, cur = node ${vals[cur]}.`
    );
  }

  snap("Reversed list: 5 → 4 → 3 → 2 → 1.");

  const W = 56, H = 56, GAP = 44;
  const totalW = n * W + (n - 1) * GAP;
  const x0 = (560 - totalW) / 2;
  const y = 110;
  const cx = (i: number) => x0 + i * (W + GAP) + W / 2;

  // Curved arrow from node a to node b along their top or bottom.
  function linkArrow(a: number, b: number, color: string) {
    const xa = cx(a);
    const xb = cx(b);
    const forward = xb > xa;
    // Forward links ride the bottom; reversed links ride the top, to separate them.
    const top = !forward;
    const yEdge = top ? y : y + H;
    const sx = xa + (forward ? W / 2 - 6 : -(W / 2 - 6));
    const ex = xb + (forward ? -(W / 2 + 6) : W / 2 + 6);
    const dir = top ? -1 : 1;
    const cy = yEdge + dir * 34;
    const path = el("path", {
      d: `M ${sx} ${yEdge} C ${(sx + ex) / 2} ${cy}, ${(sx + ex) / 2} ${cy}, ${ex} ${yEdge}`,
      fill: "none",
      stroke: color,
      "stroke-width": 2.5,
    });
    // Arrowhead at the target end.
    const ang = forward ? 0 : Math.PI;
    const ah = 7;
    const a1x = ex - ah * Math.cos(ang - 0.5);
    const a1y = yEdge - ah * Math.sin(ang - 0.5) + dir * 6;
    const a2x = ex - ah * Math.cos(ang + 0.5);
    const a2y = yEdge - ah * Math.sin(ang + 0.5) + dir * 6;
    const head2 = el("path", {
      d: `M ${ex} ${yEdge} L ${a1x} ${a1y} M ${ex} ${yEdge} L ${a2x} ${a2y}`,
      fill: "none",
      stroke: color,
      "stroke-width": 2.5,
    });
    return [path, head2];
  }

  createViz<S>(container, {
    width: 560,
    height: 240,
    steps,
    label: "Reversing a singly linked list with prev, cur, next pointers",
    draw(layer, s) {
      // Draw links from current arrows state.
      for (let i = 0; i < n; i++) {
        const tgt = s.arrows[i];
        if (tgt === -1) {
          // null marker to the right (only meaningful, skip clutter)
          continue;
        }
        const reversed = tgt < i;
        for (const node of linkArrow(i, tgt, reversed ? C.done : C.muted)) {
          layer.append(node);
        }
      }

      // Draw nodes.
      for (let i = 0; i < n; i++) {
        const x = x0 + i * (W + GAP);
        const isCur = i === s.cur;
        const isPrev = i === s.prev;
        const fill = isCur ? C.active : isPrev ? C.done : C.cell;
        const tf = isCur || isPrev ? C.textOn : C.text;
        layer.append(cell(x, y, W, H, String(vals[i]), { fill, textFill: tf }));
      }

      // Pointer labels under the relevant nodes.
      const labelY = y + H + 40;
      const placed: Record<number, string[]> = {};
      const addLbl = (idx: number, name: string) => {
        if (idx < 0) return;
        (placed[idx] ??= []).push(name);
      };
      addLbl(s.prev, "prev");
      addLbl(s.cur, "cur");
      addLbl(s.next, "next");
      for (let i = 0; i < n; i++) {
        if (placed[i]) {
          layer.append(
            text(cx(i), labelY, placed[i].join(" · "), {
              size: 12,
              weight: 700,
              fill: C.text,
            })
          );
        }
      }

      // null pointers indicators.
      if (s.prev === -1) {
        layer.append(text(x0 - 26, labelY, "prev = null", { size: 11, fill: C.muted, anchor: "start" }));
      }
      if (s.cur === -1) {
        layer.append(text(280, labelY, "cur = null", { size: 12, weight: 700, fill: C.muted }));
      }

      layer.append(text(280, 30, "Reverse a singly linked list", { size: 15, weight: 700 }));
      // Legend
      layer.append(line(x0, 52, x0 + 22, 52, { stroke: C.muted, width: 2.5 }));
      layer.append(text(x0 + 28, 52, "forward", { size: 10, fill: C.muted, anchor: "start" }));
      layer.append(line(x0 + 90, 52, x0 + 112, 52, { stroke: C.done, width: 2.5 }));
      layer.append(text(x0 + 118, 52, "reversed", { size: 10, fill: C.muted, anchor: "start" }));
    },
  });
}
