// Pattern + visualization registry.
// Patterns map 1:1 to the NeetCode roadmap categories (plus a couple of
// finer-grained algorithm tags). Each pattern can embed one or more
// interactive visualizations, defined in src/components/viz.

import { NEETCODE_CATEGORIES } from "../data/neetcode150";
import { slugify } from "./url";

/** A single interactive visualization in the library. */
export interface VizMeta {
  id: string; // matches the custom-element tag suffix, e.g. "two-pointers" -> <viz-two-pointers>
  title: string;
  blurb: string;
  /** Broad group used on the visualizations gallery page. */
  group: string;
}

export const VISUALIZATIONS: VizMeta[] = [
  { id: "two-pointers", title: "Two Pointers", blurb: "Converging pointers scan a sorted array toward a target.", group: "Arrays" },
  { id: "sliding-window", title: "Sliding Window", blurb: "A variable-width window expands and contracts over an array.", group: "Arrays" },
  { id: "binary-search", title: "Binary Search", blurb: "Halve the search space each step until the target is found.", group: "Searching" },
  { id: "linked-list", title: "Linked List Reversal", blurb: "Re-point next pointers node by node to reverse a list.", group: "Linked List" },
  { id: "stack", title: "Stack (Valid Parentheses)", blurb: "Push opens, pop on matching closes — LIFO in motion.", group: "Stack & Queue" },
  { id: "hashing", title: "Hash Map Lookup", blurb: "Two Sum: trade space for O(1) complement lookups.", group: "Hashing" },
  { id: "tree-traversal", title: "Tree Traversals", blurb: "Watch pre/in/post-order DFS and level-order BFS walk a tree.", group: "Trees" },
  { id: "trie", title: "Trie (Prefix Tree)", blurb: "Insert words and watch shared prefixes branch.", group: "Trees" },
  { id: "heap", title: "Binary Heap", blurb: "Sift-up / sift-down keep the heap property on push & pop.", group: "Heap" },
  { id: "graph-traversal", title: "Graph BFS & DFS", blurb: "Frontier-by-frontier BFS vs. deep-first DFS on a grid/graph.", group: "Graphs" },
  { id: "topological-sort", title: "Topological Sort", blurb: "Kahn's algorithm peels off zero-indegree nodes in order.", group: "Graphs" },
  { id: "dijkstra", title: "Dijkstra's Shortest Path", blurb: "A greedy priority queue relaxes edges to find shortest paths.", group: "Graphs" },
  { id: "union-find", title: "Union-Find", blurb: "Union by rank + path compression merge disjoint sets.", group: "Graphs" },
  { id: "backtracking", title: "Backtracking (Subsets)", blurb: "A decision tree explores, records, and backtracks.", group: "Backtracking" },
  { id: "intervals", title: "Merge Intervals", blurb: "Sort by start, then sweep and merge overlaps.", group: "Intervals" },
  { id: "greedy", title: "Greedy (Jump Game)", blurb: "Track the farthest reach to decide reachability greedily.", group: "Greedy" },
  { id: "dp-1d", title: "1-D DP Table", blurb: "Fill a 1-D table left to right (House Robber).", group: "Dynamic Programming" },
  { id: "dp-2d", title: "2-D DP Table", blurb: "Fill a grid cell by cell (Longest Common Subsequence).", group: "Dynamic Programming" },
];

export const VIZ_IDS = new Set(VISUALIZATIONS.map((v) => v.id));

/** NeetCode category -> visualization ids embedded on its pattern page. */
export const CATEGORY_VIZ: Record<string, string[]> = {
  "Arrays & Hashing": ["hashing"],
  "Two Pointers": ["two-pointers"],
  "Sliding Window": ["sliding-window"],
  "Stack": ["stack"],
  "Binary Search": ["binary-search"],
  "Linked List": ["linked-list"],
  "Trees": ["tree-traversal"],
  "Tries": ["trie"],
  "Heap / Priority Queue": ["heap"],
  "Backtracking": ["backtracking"],
  "Graphs": ["graph-traversal"],
  "Advanced Graphs": ["dijkstra", "union-find", "topological-sort"],
  "1-D Dynamic Programming": ["dp-1d"],
  "2-D Dynamic Programming": ["dp-2d"],
  "Greedy": ["greedy"],
  "Intervals": ["intervals"],
  "Math & Geometry": [],
  "Bit Manipulation": [],
};

/** Short, original blurbs describing each pattern (our own words). */
export const CATEGORY_BLURB: Record<string, string> = {
  "Arrays & Hashing": "Use hash maps/sets to turn O(n²) scans into O(n) lookups; the bread-and-butter of array problems.",
  "Two Pointers": "Walk two indices through a (often sorted) array to find pairs or partitions in linear time.",
  "Sliding Window": "Maintain a contiguous window and update an aggregate as it grows and shrinks.",
  "Stack": "LIFO structure for matching, monotonic scans, and expression evaluation.",
  "Binary Search": "Repeatedly halve a sorted (or monotonic) search space for logarithmic lookups.",
  "Linked List": "Pointer manipulation: reversal, fast/slow cycle detection, merging, and dummy heads.",
  "Trees": "Recursive DFS and level-order BFS over binary trees and BSTs.",
  "Tries": "Prefix trees for fast word insertion, search, and prefix queries.",
  "Heap / Priority Queue": "Keep the min/max accessible in O(log n) for top-k and scheduling problems.",
  "Backtracking": "Systematically build candidates and undo choices to enumerate combinations/permutations.",
  "Graphs": "Model relationships as nodes & edges; traverse with BFS/DFS, often on grids.",
  "Advanced Graphs": "Shortest paths (Dijkstra), MST, topological order, and union-find connectivity.",
  "1-D Dynamic Programming": "Optimal substructure captured in a one-dimensional table or rolling variables.",
  "2-D Dynamic Programming": "Grid/string DP where each cell depends on neighbors above/left.",
  "Greedy": "Make the locally optimal choice when it provably yields a global optimum.",
  "Intervals": "Sort by endpoints, then sweep to merge, insert, or count overlaps.",
  "Math & Geometry": "Number theory, matrix manipulation, and coordinate tricks.",
  "Bit Manipulation": "XOR, masks, and bit counting for space-efficient O(1) tricks.",
};

export interface PatternMeta {
  name: string;
  slug: string;
  blurb: string;
  vizIds: string[];
}

export const PATTERNS: PatternMeta[] = NEETCODE_CATEGORIES.map((name) => ({
  name,
  slug: slugify(name),
  blurb: CATEGORY_BLURB[name] ?? "",
  vizIds: CATEGORY_VIZ[name] ?? [],
}));

export function patternBySlug(slug: string): PatternMeta | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}
