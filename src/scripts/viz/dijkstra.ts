// Dijkstra's shortest path on a fixed weighted undirected graph from source A.
import { createViz, type Step } from "./base.ts";
import { line, circle, cell, text, C } from "./svg.ts";

interface Node { id: string; x: number; y: number; }
interface Edge { a: number; b: number; w: number; }
interface S extends Step {
  dist: (number | null)[]; // null = infinity
  visited: number[];
  active: number | null;   // node being settled this step
  relaxEdge: number | null; // edge index currently being relaxed
}

const INF = "∞"; // ∞

export default function dijkstra(container: HTMLElement) {
  // 5-node undirected weighted graph. Source = A (index 0).
  //   A --4-- B
  //   |  \    |
  //   1   2   5
  //   |     \ |
  //   C --8-- D --3-- E   (plus B-D, C-D, D-E, A-D diagonal)
  const nodes: Node[] = [
    { id: "A", x: 90, y: 70 },   // 0
    { id: "B", x: 330, y: 70 },  // 1
    { id: "C", x: 90, y: 250 },  // 2
    { id: "D", x: 330, y: 250 }, // 3
    { id: "E", x: 470, y: 160 }, // 4
  ];
  const edges: Edge[] = [
    { a: 0, b: 1, w: 4 }, // A-B
    { a: 0, b: 2, w: 1 }, // A-C
    { a: 0, b: 3, w: 2 }, // A-D
    { a: 1, b: 3, w: 5 }, // B-D
    { a: 2, b: 3, w: 8 }, // C-D
    { a: 3, b: 4, w: 3 }, // D-E
  ];

  // adjacency: for each node, list of {to, w, edgeIdx}
  const adj: { to: number; w: number; edgeIdx: number }[][] = nodes.map(() => []);
  edges.forEach((e, i) => {
    adj[e.a].push({ to: e.b, w: e.w, edgeIdx: i });
    adj[e.b].push({ to: e.a, w: e.w, edgeIdx: i });
  });

  const dist: (number | null)[] = nodes.map(() => null);
  dist[0] = 0;
  const visited: number[] = [];

  const steps: S[] = [];
  const snap = (caption: string, active: number | null, relaxEdge: number | null) => {
    steps.push({
      caption,
      dist: [...dist],
      visited: [...visited],
      active,
      relaxEdge,
    });
  };

  snap("Initialize: dist[A] = 0, every other node = ∞. Visited = {}.", null, null);

  for (let iter = 0; iter < nodes.length; iter++) {
    // Pick unvisited node with smallest finite dist.
    let pick = -1;
    let best = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      if (visited.includes(i) || dist[i] === null) continue;
      if ((dist[i] as number) < best) { best = dist[i] as number; pick = i; }
    }
    if (pick === -1) break;

    snap(
      `Pick unvisited node with smallest dist: ${nodes[pick].id} (dist = ${dist[pick]}).`,
      pick,
      null
    );

    visited.push(pick);

    // Relax each neighbour.
    for (const { to, w, edgeIdx } of adj[pick]) {
      if (visited.includes(to)) continue;
      const cur = dist[to];
      const cand = (dist[pick] as number) + w;
      const curStr = cur === null ? INF : String(cur);
      const newVal = Math.min(cur === null ? Infinity : cur, cand);
      const improved = newVal !== (cur === null ? Infinity : cur);
      if (improved) dist[to] = newVal;
      snap(
        `Relax ${nodes[pick].id}→${nodes[to].id}: dist[${nodes[to].id}] = min(${curStr}, ${dist[pick]}+${w}) = ${newVal}` +
          (improved ? " (improved)" : " (no change)"),
        pick,
        edgeIdx
      );
    }

    snap(`Settle ${nodes[pick].id}: mark as done. Visited = {${visited.map((i) => nodes[i].id).join(", ")}}.`, pick, null);
  }

  snap(
    `Done. Shortest distances from A: ${nodes.map((n, i) => `${n.id}=${dist[i]}`).join(", ")}.`,
    null,
    null
  );

  const R = 24;

  createViz<S>(container, {
    width: 560,
    height: 330,
    steps,
    label: "Dijkstra's shortest path from source A",
    draw(layer, s) {
      // Edges first.
      edges.forEach((e, i) => {
        const na = nodes[e.a];
        const nb = nodes[e.b];
        const isRelax = i === s.relaxEdge;
        layer.append(
          line(na.x, na.y, nb.x, nb.y, {
            stroke: isRelax ? C.compare : C.stroke,
            width: isRelax ? 4 : 2,
          })
        );
        // weight label at midpoint, nudged off the line.
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        layer.append(
          text(mx, my - 10, String(e.w), {
            size: 13,
            weight: 700,
            mono: true,
            fill: isRelax ? C.compare : C.text,
          })
        );
      });

      // Nodes on top.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const isActive = i === s.active;
        const isVisited = s.visited.includes(i);
        const fill = isActive ? C.active : isVisited ? C.done : C.cell;
        const tFill = isActive || isVisited ? C.textOn : C.text;
        layer.append(circle(n.x, n.y, R, { fill, stroke: C.stroke, width: 2 }));
        layer.append(text(n.x, n.y, n.id, { size: 16, weight: 700, mono: true, fill: tFill }));
      }

      // dist[] table along the bottom.
      const cw = 56;
      const ch = 30;
      const startX = (560 - cw * nodes.length) / 2;
      const ty = 300;
      layer.append(text(startX - 14, ty + ch / 2, "dist", { anchor: "end", size: 12, weight: 700 }));
      for (let i = 0; i < nodes.length; i++) {
        const x = startX + i * cw;
        const dv = s.dist[i];
        const isActive = i === s.active;
        const isVisited = s.visited.includes(i);
        const fill = isActive ? C.active : isVisited ? C.done : C.cell;
        const tFill = isActive || isVisited ? C.textOn : C.text;
        layer.append(text(x + cw / 2, ty - 8, nodes[i].id, { size: 11, weight: 700, mono: true }));
        layer.append(
          cell(x, ty, cw - 6, ch, dv === null ? INF : String(dv), {
            fill,
            textFill: tFill,
            fontSize: 14,
          })
        );
      }
    },
  });
}
