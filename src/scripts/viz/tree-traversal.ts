// DFS pre-order traversal of a binary tree (root, left, right).
import { createViz, type Step } from "./base.ts";
import { line, circle, text, C } from "./svg.ts";

interface Node { val: number; x: number; y: number; left: number | null; right: number | null; }
interface S extends Step { current: number | null; visited: number[]; output: number[]; }

export default function treeTraversal(container: HTMLElement) {
  // Fixed 7-node tree: 1 root; 2 & 3 children; 4 & 5 under 2; 6 & 7 under 3.
  //         1
  //       /   \
  //      2     3
  //     / \   / \
  //    4   5 6   7
  const nodes: Node[] = [
    { val: 1, x: 280, y: 50, left: 1, right: 2 }, // index 0
    { val: 2, x: 150, y: 140, left: 3, right: 4 }, // index 1
    { val: 3, x: 410, y: 140, left: 5, right: 6 }, // index 2
    { val: 4, x: 85, y: 230, left: null, right: null }, // index 3
    { val: 5, x: 215, y: 230, left: null, right: null }, // index 4
    { val: 6, x: 345, y: 230, left: null, right: null }, // index 5
    { val: 7, x: 475, y: 230, left: null, right: null }, // index 6
  ];

  const steps: S[] = [];
  const visited: number[] = [];
  const output: number[] = [];

  steps.push({
    caption:
      "Pre-order DFS: record the node, then recurse left, then right. (In-order records between left & right; post-order records after both.)",
    current: null,
    visited: [],
    output: [],
  });

  function preorder(idx: number | null) {
    if (idx === null) return;
    const node = nodes[idx];
    // Visit (record) the node first — this is what makes it "pre-order".
    visited.push(idx);
    output.push(node.val);
    steps.push({
      caption: `Visit node ${node.val} → record it. Output: ${output.join(" ")}`,
      current: idx,
      visited: [...visited],
      output: [...output],
    });
    if (node.left !== null) {
      steps.push({
        caption: `Node ${node.val}: recurse into left child ${nodes[node.left].val}.`,
        current: idx,
        visited: [...visited],
        output: [...output],
      });
    }
    preorder(node.left);
    if (node.right !== null) {
      steps.push({
        caption: `Node ${node.val}: recurse into right child ${nodes[node.right].val}.`,
        current: idx,
        visited: [...visited],
        output: [...output],
      });
    }
    preorder(node.right);
  }

  preorder(0);

  steps.push({
    caption: `Done. Pre-order traversal: ${output.join(" ")}`,
    current: null,
    visited: [...visited],
    output: [...output],
  });

  const R = 22;

  createViz<S>(container, {
    width: 560,
    height: 310,
    steps,
    label: "Pre-order DFS traversal of a binary tree",
    draw(layer, s) {
      // Edges first.
      for (const node of nodes) {
        for (const child of [node.left, node.right]) {
          if (child !== null) {
            const c = nodes[child];
            layer.append(line(node.x, node.y, c.x, c.y, { stroke: C.stroke, width: 2 }));
          }
        }
      }
      // Nodes on top.
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isCurrent = i === s.current;
        const isVisited = s.visited.includes(i);
        const fill = isCurrent ? C.active : isVisited ? C.visited : C.cell;
        const textFill = isCurrent || isVisited ? C.textOn : C.text;
        layer.append(circle(node.x, node.y, R, { fill, stroke: C.stroke, width: 2 }));
        layer.append(text(node.x, node.y, String(node.val), { size: 16, weight: 700, fill: textFill, mono: true }));
      }
      // Output sequence at the bottom.
      layer.append(text(280, 285, `Output: ${s.output.join(" ") || "—"}`, { size: 15, weight: 700, mono: true }));
    },
  });
}
