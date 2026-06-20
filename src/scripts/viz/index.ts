// Visualization registry. Each entry lazily imports its module so a page only
// downloads the animation(s) it actually renders.
type Loader = () => Promise<{ default: (el: HTMLElement) => void }>;

const REGISTRY: Record<string, Loader> = {
  "two-pointers": () => import("./two-pointers.ts"),
  "sliding-window": () => import("./sliding-window.ts"),
  "binary-search": () => import("./binary-search.ts"),
  "linked-list": () => import("./linked-list.ts"),
  "stack": () => import("./stack.ts"),
  "hashing": () => import("./hashing.ts"),
  "tree-traversal": () => import("./tree-traversal.ts"),
  "trie": () => import("./trie.ts"),
  "heap": () => import("./heap.ts"),
  "graph-traversal": () => import("./graph-traversal.ts"),
  "topological-sort": () => import("./topological-sort.ts"),
  "dijkstra": () => import("./dijkstra.ts"),
  "union-find": () => import("./union-find.ts"),
  "backtracking": () => import("./backtracking.ts"),
  "intervals": () => import("./intervals.ts"),
  "greedy": () => import("./greedy.ts"),
  "dp-1d": () => import("./dp-1d.ts"),
  "dp-2d": () => import("./dp-2d.ts"),
};

export async function renderViz(el: HTMLElement, id: string): Promise<void> {
  const loader = REGISTRY[id];
  if (!loader) {
    el.innerHTML = `<div class="viz muted text-sm">Unknown visualization “${id}”.</div>`;
    return;
  }
  const mod = await loader();
  mod.default(el);
}
