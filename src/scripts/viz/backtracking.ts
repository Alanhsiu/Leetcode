// Subsets via backtracking over [1,2,3], shown as a binary include/exclude tree.
import { createViz, type Step } from "./base.ts";
import { line, circle, cell, text, C } from "./svg.ts";

interface TreeNode { id: number; x: number; y: number; depth: number; parent: number | null; include: boolean | null; }
interface S extends Step {
  current: number;        // current tree node id
  path: number[];         // tree node ids on the active recursion path (root..current)
  partial: number[];      // current partial subset values
  results: number[][];    // completed subsets so far
  recordLeaf: boolean;    // true when this step records a subset
}

export default function backtracking(container: HTMLElement) {
  const input = [1, 2];
  const maxDepth = input.length; // tree depth

  // Build a full binary decision tree (depth 0..maxDepth). At each depth d we
  // decide whether to include input[d]. Left child = include, right = exclude.
  // Leaves at depth maxDepth record the subset. For [1,2]: 1+2+4 = 7 nodes.
  const nodes: TreeNode[] = [];
  // layout columns: leaves evenly spaced; parents centered over children.
  const leafXs: number[] = [];
  const leafCount = 1 << maxDepth; // 2^depth leaves
  const leftPad = 70;
  const usableW = 420;
  for (let i = 0; i < leafCount; i++) {
    leafXs.push(leftPad + (usableW * i) / (leafCount - 1));
  }
  const depthY = [50, 145, 240];

  let nextId = 0;
  function build(depth: number, parent: number | null, include: boolean | null): number {
    const id = nextId++;
    nodes.push({ id, x: 0, y: depthY[depth], depth, parent, include });
    if (depth < maxDepth) {
      build(depth + 1, id, true);  // include input[depth]
      build(depth + 1, id, false); // exclude input[depth]
    }
    return id;
  }
  build(0, null, null);

  // Compute x: leaves left-to-right, internal = average of children.
  let leafCursor = 0;
  function setX(id: number): number {
    const children = nodes.filter((n) => n.parent === id);
    if (children.length === 0) {
      const x = leafXs[leafCursor++];
      nodes[id].x = x;
      return x;
    }
    const xs = children.map((c) => setX(c.id));
    const x = xs.reduce((a, b) => a + b, 0) / xs.length;
    nodes[id].x = x;
    return x;
  }
  setX(0);

  const childOf = (id: number, inc: boolean): number =>
    nodes.find((n) => n.parent === id && n.include === inc)!.id;

  const steps: S[] = [];
  const partial: number[] = [];
  const results: number[][] = [];

  const snap = (caption: string, current: number, path: number[], recordLeaf: boolean) => {
    steps.push({
      caption,
      current,
      path: [...path],
      partial: [...partial],
      results: results.map((r) => [...r]),
      recordLeaf,
    });
  };

  snap(`Backtracking subsets of [${input.join(", ")}]. At each level decide include (left) or exclude (right) the next element.`, 0, [0], false);

  function dfs(id: number, path: number[]) {
    const depth = nodes[id].depth;
    if (depth === maxDepth) {
      results.push([...partial]);
      snap(`Leaf reached → record subset {${partial.join(", ")}}.`, id, path, true);
      return;
    }
    const val = input[depth];

    // Include branch (left).
    const inc = childOf(id, true);
    partial.push(val);
    snap(`Include ${val} → partial = {${partial.join(", ")}}.`, inc, [...path, inc], false);
    dfs(inc, [...path, inc]);
    partial.pop();
    snap(`Backtrack: remove ${val} → partial = {${partial.join(", ")}}.`, id, path, false);

    // Exclude branch (right).
    const exc = childOf(id, false);
    snap(`Exclude ${val} → partial = {${partial.join(", ")}}.`, exc, [...path, exc], false);
    dfs(exc, [...path, exc]);
  }

  dfs(0, [0]);

  snap(`Done. All ${results.length} subsets found: ${results.map((r) => `{${r.join(",")}}`).join("  ")}.`, 0, [0], false);

  const R = 15;

  createViz<S>(container, {
    width: 560,
    height: 340,
    steps,
    label: "Subsets of [1,2,3] via backtracking decision tree",
    draw(layer, s) {
      const onPath = (id: number) => s.path.includes(id);
      // Edges first.
      for (const n of nodes) {
        if (n.parent === null) continue;
        const p = nodes[n.parent];
        const active = onPath(n.id) && onPath(n.parent);
        layer.append(
          line(p.x, p.y, n.x, n.y, {
            stroke: active ? C.active : C.stroke,
            width: active ? 3.5 : 1.5,
          })
        );
        // include/exclude label on the edge.
        const mx = (p.x + n.x) / 2;
        const my = (p.y + n.y) / 2;
        layer.append(
          text(mx + (n.include ? -8 : 8), my, n.include ? "in" : "ex", {
            size: 9,
            weight: 600,
            fill: active ? C.active : C.muted,
          })
        );
      }
      // Nodes on top.
      for (const n of nodes) {
        const isCurrent = n.id === s.current;
        const isPath = onPath(n.id);
        const fill = isCurrent ? C.active : isPath ? C.visited : C.cell;
        const tFill = isCurrent || isPath ? C.textOn : C.text;
        // root labeled "{}", others labeled by the element they decide on
        const lbl = n.depth === 0 ? "{}" : String(input[n.depth - 1]);
        layer.append(circle(n.x, n.y, R, { fill, stroke: C.stroke, width: 1.5 }));
        layer.append(text(n.x, n.y, lbl, { size: 11, weight: 700, mono: true, fill: tFill }));
      }

      // Partial subset row (left) and results list (right) at the bottom.
      const by = 305;
      layer.append(text(20, by, "partial:", { anchor: "start", size: 12, weight: 700 }));
      const pvals = s.partial;
      const cw = 26;
      if (pvals.length === 0) {
        layer.append(text(85, by, "{}", { anchor: "start", size: 13, weight: 700, mono: true }));
      } else {
        for (let i = 0; i < pvals.length; i++) {
          layer.append(
            cell(78 + i * (cw + 4), by - cw / 2, cw, cw, String(pvals[i]), {
              fill: C.active,
              textFill: C.textOn,
              fontSize: 13,
            })
          );
        }
      }

      const resStr = s.results.length
        ? s.results.map((r) => `{${r.join(",")}}`).join("  ")
        : "—";
      layer.append(text(20, by + 24, `found (${s.results.length}): ${resStr}`, { anchor: "start", size: 12, weight: 600, mono: true, fill: C.done }));
    },
  });
}
