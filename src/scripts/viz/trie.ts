// Trie (prefix tree) insertion — insert "cat", "car", "dog" letter by letter.
import { createViz, type Step } from "./base.ts";
import { line, circle, text, C } from "./svg.ts";

interface TrieNode {
  id: number;
  letter: string; // "" for the root
  x: number;
  y: number;
  parent: number | null;
  isEnd: boolean;
}
interface S extends Step { active: number; nodeCount: number; ends: number[]; }

export default function trie(container: HTMLElement) {
  const words = ["cat", "car", "dog"];

  // Build the trie while precomputing a tidy horizontal layout per depth.
  const root: TrieNode = { id: 0, letter: "", x: 280, y: 45, parent: null, isEnd: false };
  const nodes: TrieNode[] = [root];
  // children[parentId][letter] = childId
  const children: Map<number, Map<string, number>> = new Map();
  children.set(0, new Map());

  // Pre-layout horizontal slots per depth so the tree stays readable.
  // Each depth gets evenly spread x-positions assigned left-to-right as nodes appear.
  const depthX: number[] = [280, 0, 0, 0]; // root centered; deeper rows filled below
  const slotWidth = 90;
  const rowOf = (depth: number) => 45 + depth * 75;

  // Track how many nodes exist at each depth to assign x slots.
  const usedSlots: number[] = [1, 0, 0, 0];
  function nextX(depth: number): number {
    // Spread depth-d nodes around center 280.
    const i = usedSlots[depth];
    usedSlots[depth]++;
    // Layout: positions like 280 +/- offsets. Up to ~5 per depth fits.
    const offsets = [-2, -1, 0, 1, 2];
    const off = offsets[Math.min(i, offsets.length - 1)];
    return 280 + off * slotWidth;
  }
  // Suppress unused-warning for depthX scaffolding by using it for the root row.
  depthX[0] = 280;

  const steps: S[] = [];
  const endIds: number[] = [];

  steps.push({
    caption: "Build a trie by inserting words letter by letter. Shared prefixes reuse the same path.",
    active: 0,
    nodeCount: nodes.length,
    ends: [],
  });

  for (const word of words) {
    let parentId = 0;
    let depth = 0;
    for (const ch of word) {
      depth++;
      let kids = children.get(parentId);
      if (!kids) {
        kids = new Map();
        children.set(parentId, kids);
      }
      let childId = kids.get(ch);
      if (childId === undefined) {
        // Create a new node.
        const node: TrieNode = {
          id: nodes.length,
          letter: ch,
          x: nextX(depth),
          y: rowOf(depth),
          parent: parentId,
          isEnd: false,
        };
        nodes.push(node);
        children.set(node.id, new Map());
        kids.set(ch, node.id);
        childId = node.id;
        steps.push({
          caption: `Insert "${word}": create node '${ch}' (no existing edge).`,
          active: childId,
          nodeCount: nodes.length,
          ends: [...endIds],
        });
      } else {
        steps.push({
          caption: `Insert "${word}": reuse existing node '${ch}' (shared prefix).`,
          active: childId,
          nodeCount: nodes.length,
          ends: [...endIds],
        });
      }
      parentId = childId;
    }
    // Mark the final node as a word end.
    nodes[parentId].isEnd = true;
    if (!endIds.includes(parentId)) endIds.push(parentId);
    steps.push({
      caption: `Finished "${word}": mark node '${nodes[parentId].letter}' as a word end.`,
      active: parentId,
      nodeCount: nodes.length,
      ends: [...endIds],
    });
  }

  steps.push({
    caption: 'Trie complete. "cat" & "car" share the c→a prefix; "dog" is a separate branch.',
    active: 0,
    nodeCount: nodes.length,
    ends: [...endIds],
  });

  const R = 19;

  createViz<S>(container, {
    width: 560,
    height: 300,
    steps,
    label: "Trie insertion of words",
    draw(layer, s) {
      const visible = nodes.slice(0, s.nodeCount);
      const visibleIds = new Set(visible.map((n) => n.id));
      // Edges first.
      for (const node of visible) {
        if (node.parent !== null && visibleIds.has(node.parent)) {
          const p = nodes[node.parent];
          layer.append(line(p.x, p.y, node.x, node.y, { stroke: C.stroke, width: 2 }));
        }
      }
      // Nodes on top.
      for (const node of visible) {
        const isActive = node.id === s.active && node.id !== 0;
        const isEnd = s.ends.includes(node.id);
        const fill = isActive ? C.active : isEnd ? C.done : node.id === 0 ? C.muted : C.cell;
        const textFill = isActive || isEnd || node.id === 0 ? C.textOn : C.text;
        // Word-end nodes get a double ring.
        if (isEnd) layer.append(circle(node.x, node.y, R + 4, { fill: "none", stroke: C.done, width: 2 }));
        layer.append(circle(node.x, node.y, R, { fill, stroke: C.stroke, width: 2 }));
        const label = node.id === 0 ? "•" : node.letter;
        layer.append(text(node.x, node.y, label, { size: 16, weight: 700, fill: textFill, mono: true }));
      }
      layer.append(text(280, 25, "root", { size: 11, fill: C.muted }));
      layer.append(text(280, 288, "double ring = end of a word", { size: 12, fill: C.muted }));
    },
  });
}
