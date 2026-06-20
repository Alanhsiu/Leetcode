// Breadth-First Search (BFS) on an undirected graph, starting from A.
// A queue drives the order; DFS is identical but swaps the queue for a stack.
import { createViz, type Step } from "./base.ts";
import { line, circle, text, cell, C } from "./svg.ts";

interface Node { id: string; x: number; y: number; }
interface S extends Step { current: string | null; visited: string[]; queue: string[]; }

export default function graphTraversal(container: HTMLElement) {
  // Fixed undirected graph of 6 nodes A–F.
  //   A — B — D
  //   |   |   |
  //   C — E — F
  const nodes: Node[] = [
    { id: "A", x: 110, y: 80 },
    { id: "B", x: 280, y: 80 },
    { id: "D", x: 450, y: 80 },
    { id: "C", x: 110, y: 220 },
    { id: "E", x: 280, y: 220 },
    { id: "F", x: 450, y: 220 },
  ];
  const pos: Record<string, Node> = {};
  for (const n of nodes) pos[n.id] = n;

  // Undirected edges; adjacency lists kept in fixed (alphabetical) order.
  const edges: [string, string][] = [
    ["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "E"], ["D", "F"], ["E", "F"],
  ];
  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  for (const k of Object.keys(adj)) adj[k].sort();

  const steps: S[] = [];
  const visited: string[] = ["A"];
  const queue: string[] = ["A"];

  steps.push({
    caption:
      "BFS from A: a FIFO queue holds nodes to explore. Enqueue A. (DFS is the same algorithm but uses a stack instead of a queue.)",
    current: null,
    visited: [...visited],
    queue: [...queue],
  });

  while (queue.length > 0) {
    const cur = queue.shift() as string;
    steps.push({
      caption: `Dequeue ${cur}. Mark it as the node we are now exploring.`,
      current: cur,
      visited: [...visited],
      queue: [...queue],
    });
    const newlyEnqueued: string[] = [];
    for (const nb of adj[cur]) {
      if (!visited.includes(nb)) {
        visited.push(nb);
        queue.push(nb);
        newlyEnqueued.push(nb);
      }
    }
    if (newlyEnqueued.length > 0) {
      steps.push({
        caption: `From ${cur}, enqueue unvisited neighbors ${newlyEnqueued.join(", ")}. Queue: [${queue.join(", ")}].`,
        current: cur,
        visited: [...visited],
        queue: [...queue],
      });
    } else {
      steps.push({
        caption: `${cur} has no unvisited neighbors. Nothing to enqueue.`,
        current: cur,
        visited: [...visited],
        queue: [...queue],
      });
    }
  }

  steps.push({
    caption: `Queue empty — BFS complete. Visit order: ${visited.join(" → ")}.`,
    current: null,
    visited: [...visited],
    queue: [],
  });

  const R = 24;

  createViz<S>(container, {
    width: 560,
    height: 320,
    steps,
    label: "Breadth-first search on an undirected graph",
    draw(layer, s) {
      // Edges first.
      for (const [u, v] of edges) {
        const a = pos[u];
        const b = pos[v];
        layer.append(line(a.x, a.y, b.x, b.y, { stroke: C.stroke, width: 2 }));
      }
      // Nodes on top.
      for (const n of nodes) {
        const isCurrent = n.id === s.current;
        const isVisited = s.visited.includes(n.id);
        const fill = isCurrent ? C.active : isVisited ? C.visited : C.cell;
        const textFill = isCurrent || isVisited ? C.textOn : C.text;
        layer.append(circle(n.x, n.y, R, { fill, stroke: C.stroke, width: 2 }));
        layer.append(text(n.x, n.y, n.id, { size: 16, weight: 700, fill: textFill, mono: true }));
      }
      // Queue as a labeled row of cells.
      layer.append(text(28, 285, "Queue:", { anchor: "start", size: 13, weight: 700 }));
      const cw = 34;
      const cy = 270;
      const x0 = 95;
      if (s.queue.length === 0) {
        layer.append(text(x0 + 10, 285, "—", { anchor: "start", size: 14, mono: true }));
      } else {
        for (let i = 0; i < s.queue.length; i++) {
          layer.append(
            cell(x0 + i * (cw + 6), cy, cw, 30, s.queue[i], {
              fill: i === 0 ? C.highlight : C.cell,
              textFill: i === 0 ? C.textOn : C.text,
              fontSize: 14,
            })
          );
        }
      }
    },
  });
}
