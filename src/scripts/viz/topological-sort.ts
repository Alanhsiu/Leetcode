// Kahn's algorithm for topological sort on a DAG.
// Repeatedly remove a node with in-degree 0 and decrement its successors.
import { createViz, type Step } from "./base.ts";
import { el, circle, text, cell, C } from "./svg.ts";

interface Node { id: string; x: number; y: number; }
interface S extends Step {
  active: string | null;
  indeg: Record<string, number>;
  removed: string[];
  order: string[];
}

export default function topologicalSort(container: HTMLElement) {
  // Fixed DAG of 6 nodes A–F (directed edges).
  //   A → C → E
  //   A → D    ↑
  //   B → C    |
  //   B → D → E→F  (D→E, E→F)
  const nodes: Node[] = [
    { id: "A", x: 90, y: 70 },
    { id: "B", x: 90, y: 230 },
    { id: "C", x: 250, y: 70 },
    { id: "D", x: 250, y: 230 },
    { id: "E", x: 410, y: 150 },
    { id: "F", x: 530, y: 150 },
  ];
  const pos: Record<string, Node> = {};
  for (const n of nodes) pos[n.id] = n;

  const edges: [string, string][] = [
    ["A", "C"], ["A", "D"], ["B", "C"], ["B", "D"], ["C", "E"], ["D", "E"], ["E", "F"],
  ];
  const adj: Record<string, string[]> = {};
  const indeg: Record<string, number> = {};
  for (const n of nodes) { adj[n.id] = []; indeg[n.id] = 0; }
  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++; }
  for (const k of Object.keys(adj)) adj[k].sort();

  const steps: S[] = [];
  const removed: string[] = [];
  const order: string[] = [];

  const snapshot = (): Record<string, number> => ({ ...indeg });

  steps.push({
    caption:
      "Kahn's algorithm: compute every node's in-degree (number of incoming edges), then repeatedly remove a node whose in-degree is 0.",
    active: null,
    indeg: snapshot(),
    removed: [],
    order: [],
  });

  // Deterministic pick: smallest id among in-degree-0, not-yet-removed nodes.
  const ids = nodes.map((n) => n.id).sort();
  while (order.length < nodes.length) {
    let pick: string | null = null;
    for (const id of ids) {
      if (!removed.includes(id) && indeg[id] === 0) { pick = id; break; }
    }
    if (pick === null) break; // would mean a cycle; our DAG has none.

    removed.push(pick);
    order.push(pick);
    steps.push({
      caption: `${pick} has in-degree 0 → pick it and append to the order. Order: ${order.join(" ")}.`,
      active: pick,
      indeg: snapshot(),
      removed: [...removed],
      order: [...order],
    });

    const dec = adj[pick];
    for (const v of dec) indeg[v]--;
    if (dec.length > 0) {
      steps.push({
        caption: `Remove ${pick}'s outgoing edges → decrement in-degree of ${dec.join(", ")}.`,
        active: pick,
        indeg: snapshot(),
        removed: [...removed],
        order: [...order],
      });
    }
  }

  steps.push({
    caption: `All nodes removed. A valid topological order: ${order.join(" → ")}.`,
    active: null,
    indeg: snapshot(),
    removed: [...removed],
    order: [...order],
  });

  const R = 24;

  // Build a directed edge as a line shortened to the node radius plus an arrowhead.
  function arrow(u: string, v: string): SVGGElement {
    const a = pos[u];
    const b = pos[v];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const x1 = a.x + ux * R;
    const y1 = a.y + uy * R;
    const x2 = b.x - ux * R;
    const y2 = b.y - uy * R;
    const g = el("g");
    g.append(el("line", { x1, y1, x2, y2, stroke: C.stroke, "stroke-width": 2 }));
    // Triangle arrowhead at (x2, y2) pointing along (ux, uy).
    const ah = 9;
    const aw = 5;
    const bx = x2 - ux * ah;
    const by = y2 - uy * ah;
    // Perpendicular.
    const px = -uy;
    const py = ux;
    const p1x = bx + px * aw;
    const p1y = by + py * aw;
    const p2x = bx - px * aw;
    const p2y = by - py * aw;
    g.append(
      el("path", {
        d: `M ${x2} ${y2} L ${p1x} ${p1y} L ${p2x} ${p2y} Z`,
        fill: C.stroke,
        stroke: "none",
      })
    );
    return g;
  }

  createViz<S>(container, {
    width: 600,
    height: 330,
    steps,
    label: "Topological sort with Kahn's algorithm",
    draw(layer, s) {
      // Directed edges first.
      for (const [u, v] of edges) layer.append(arrow(u, v));
      // Nodes on top.
      for (const n of nodes) {
        const isActive = n.id === s.active;
        const isRemoved = s.removed.includes(n.id) && !isActive;
        const fill = isActive ? C.active : isRemoved ? C.done : C.cell;
        const textFill = isActive || isRemoved ? C.textOn : C.text;
        layer.append(circle(n.x, n.y, R, { fill, stroke: C.stroke, width: 2 }));
        layer.append(text(n.x, n.y, n.id, { size: 16, weight: 700, fill: textFill, mono: true }));
        // In-degree badge near the node (top-right).
        if (!s.removed.includes(n.id)) {
          layer.append(circle(n.x + R - 2, n.y - R + 2, 10, { fill: C.compare, stroke: C.stroke, width: 1 }));
          layer.append(
            text(n.x + R - 2, n.y - R + 2, String(s.indeg[n.id]), { size: 11, weight: 700, fill: C.textOn, mono: true })
          );
        }
      }
      // Growing topological order as a row of cells.
      layer.append(text(20, 308, "Order:", { anchor: "start", size: 13, weight: 700 }));
      const cw = 30;
      const x0 = 80;
      for (let i = 0; i < s.order.length; i++) {
        layer.append(
          cell(x0 + i * (cw + 6), 293, cw, 30, s.order[i], { fill: C.done, textFill: C.textOn, fontSize: 14 })
        );
      }
    },
  });
}
