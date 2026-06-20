// Union-Find (disjoint set) with union by rank and path compression.
// Elements 0..5; a fixed sequence of union/find operations is replayed.
import { createViz, type Step } from "./base.ts";
import { el, circle, text, C } from "./svg.ts";

interface S extends Step {
  parent: number[];
  rank: number[];
  active: number[]; // affected roots / re-pointed nodes to highlight
}

export default function unionFind(container: HTMLElement) {
  const N = 6;
  // Fixed grid positions for elements 0..5.
  const px = (i: number): number => 70 + i * 90;
  const py = 90;

  const parent: number[] = Array.from({ length: N }, (_, i) => i);
  const rank: number[] = new Array(N).fill(0);

  const steps: S[] = [];
  const snapParent = (): number[] => [...parent];
  const snapRank = (): number[] => [...rank];

  steps.push({
    caption:
      "Union-Find: each element starts as its own root (parent points to itself, rank 0). Roots have no upward arrow.",
    parent: snapParent(),
    rank: snapRank(),
    active: [],
  });

  // Plain find (no compression) used internally by union.
  function findRoot(x: number): number {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    return r;
  }

  function union(a: number, b: number): void {
    const ra = findRoot(a);
    const rb = findRoot(b);
    if (ra === rb) {
      steps.push({
        caption: `union(${a}, ${b}): both already share root ${ra}. Nothing to do.`,
        parent: snapParent(),
        rank: snapRank(),
        active: [ra],
      });
      return;
    }
    // Union by rank: attach the lower-rank root under the higher-rank root.
    let hi = ra;
    let lo = rb;
    if (rank[ra] < rank[rb]) { hi = rb; lo = ra; }
    parent[lo] = hi;
    let rankNote = "";
    if (rank[ra] === rank[rb]) {
      rank[hi]++;
      rankNote = ` Equal ranks, so rank[${hi}] becomes ${rank[hi]}.`;
    }
    steps.push({
      caption: `union(${a}, ${b}): roots ${ra} and ${rb}. By rank, point root ${lo} under root ${hi}.${rankNote}`,
      parent: snapParent(),
      rank: snapRank(),
      active: [hi, lo],
    });
  }

  // find WITH path compression: re-point every node on the path to the root.
  function findCompress(x: number): void {
    const root = findRoot(x);
    const path: number[] = [];
    let cur = x;
    while (parent[cur] !== cur) { path.push(cur); cur = parent[cur]; }
    const changed = path.filter((n) => parent[n] !== root);
    for (const n of path) parent[n] = root;
    if (changed.length > 0) {
      steps.push({
        caption: `find(${x}): root is ${root}. Path compression re-points ${changed.join(", ")} directly to ${root}.`,
        parent: snapParent(),
        rank: snapRank(),
        active: [root, ...changed],
      });
    } else {
      steps.push({
        caption: `find(${x}): root is ${root}; already directly attached, no compression needed.`,
        parent: snapParent(),
        rank: snapRank(),
        active: [root, x],
      });
    }
  }

  // Fixed operation sequence.
  union(0, 1);
  union(2, 3);
  union(1, 3);
  findCompress(0);
  union(4, 5);
  union(3, 5);

  steps.push({
    caption: `Done. Two trees merged into one set {0,1,2,3,4,5}; compression keeps trees flat for fast future finds.`,
    parent: snapParent(),
    rank: snapRank(),
    active: [],
  });

  const R = 20;

  // Curved-ish straight arrow from child to parent, trimmed to circle radius.
  function parentArrow(child: number, par: number): SVGGElement {
    const ax = px(child);
    const ay = py;
    const bx = px(par);
    const by = py;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    // Bow the line upward so multiple arrows along the same row stay readable.
    const midx = (ax + bx) / 2;
    const bow = Math.min(60, 20 + len * 0.18);
    const midy = py - bow;
    const sx = ax + ux * R;
    const sy = ay + uy * R;
    const ex = bx - ux * R;
    const ey = by - uy * R - 0; // approach from the row level
    const g = el("g");
    g.append(
      el("path", {
        d: `M ${sx} ${sy} Q ${midx} ${midy} ${ex} ${ey - 0}`,
        fill: "none",
        stroke: C.stroke,
        "stroke-width": 2,
      })
    );
    // Arrowhead pointing toward parent along the tangent (midpoint -> parent).
    const tdx = ex - midx;
    const tdy = ey - midy;
    const tlen = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
    const tx = tdx / tlen;
    const ty = tdy / tlen;
    const ah = 9;
    const aw = 5;
    const bxh = ex - tx * ah;
    const byh = ey - ty * ah;
    const ppx = -ty;
    const ppy = tx;
    g.append(
      el("path", {
        d: `M ${ex} ${ey} L ${bxh + ppx * aw} ${byh + ppy * aw} L ${bxh - ppx * aw} ${byh - ppy * aw} Z`,
        fill: C.stroke,
        stroke: "none",
      })
    );
    return g;
  }

  createViz<S>(container, {
    width: 580,
    height: 230,
    steps,
    label: "Union-Find with union by rank and path compression",
    draw(layer, s) {
      // Parent arrows first (skip roots: parent[i] === i).
      for (let i = 0; i < N; i++) {
        if (s.parent[i] !== i) layer.append(parentArrow(i, s.parent[i]));
      }
      // Nodes on top.
      for (let i = 0; i < N; i++) {
        const isRoot = s.parent[i] === i;
        const isActive = s.active.includes(i);
        const fill = isActive ? C.active : isRoot ? C.visited : C.cell;
        const textFill = isActive || isRoot ? C.textOn : C.text;
        layer.append(circle(px(i), py, R, { fill, stroke: C.stroke, width: 2 }));
        layer.append(text(px(i), py, String(i), { size: 15, weight: 700, fill: textFill, mono: true }));
        // Rank shown under each root.
        if (isRoot) {
          layer.append(text(px(i), py + R + 16, `root r=${s.rank[i]}`, { size: 11, weight: 600, fill: C.muted }));
        }
      }
      // Legend.
      layer.append(text(20, 200, "Arrow = parent pointer. Roots point to themselves (no arrow).", {
        anchor: "start", size: 12, fill: C.muted,
      }));
    },
  });
}
