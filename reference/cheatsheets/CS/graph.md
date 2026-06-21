# ⚡ Graph & Data Structures Cheat Sheet

## 1. Traversal
* **BFS (Breadth-First Search)**
    * **Core:** `Queue` (FIFO). Level-by-level.
    * **Use:** Shortest path in **unweighted** graphs, Peer-to-peer networks, Web crawlers.
    * **Time:** $O(V+E)$
* **DFS (Depth-First Search)**
    * **Core:** `Stack` (LIFO) or Recursion. Go deep, then backtrack.
    * **Use:** Cycle detection, Topological sort, Path existence, Maze solving.
    * **Time:** $O(V+E)$
* **Bidirectional BFS**
    * **Core:** Run two BFS searches simultaneously (Source $\to$ Target, Target $\to$ Source).
    * **Why:** Reduces search space from $b^d$ to $2b^{d/2}$ (huge optimization for Social Graphs).

## 2. Shortest Path
* **Dijkstra**
    * **Core:** `Min-Heap (Priority Queue)`, Greedy approach.
    * **Constraint:** **Non-negative** weights only.
    * **Time:** $O(E \log V)$
    * **Key Phrase:** "Relaxation of edges based on current shortest distance."
* **Bellman-Ford**
    * **Core:** Relax all edges $V-1$ times.
    * **Capabilty:** Handles **negative weights**. Detects negative cycles.
    * **Time:** $O(VE)$ (Slower than Dijkstra).
* **Floyd-Warshall**
    * **Core:** Dynamic Programming, All-Pairs Shortest Path.
    * **Logic:** `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.
    * **Time:** $O(V^3)$. Good for small, dense graphs.

## 3. Connectivity & Components
* **Union-Find (DSU - Disjoint Set Union)**
    * **Core:** `Find` (with **Path Compression**) + `Union` (by **Rank/Size**).
    * **Use:** Connected components, Cycle detection in undirected graphs, Kruskal’s MST.
    * **Time:** $O(\alpha(N))$ (Inverse Ackermann function $\approx O(1)$).
* **Tarjan’s / Kosaraju’s**
    * **Use:** Finding **Strongly Connected Components (SCCs)** in directed graphs.
    * **Concept:** DFS + Discovery times/Low-link values.

## 4. Ordering & Dependencies
* **Topological Sort**
    * **Constraint:** **DAG** (Directed Acyclic Graph) only.
    * **Kahn’s Algo:** Maintain `in-degree` array. Queue nodes with `in-degree == 0`.
    * **DFS Algo:** Reverse post-order traversal.
    * **Use:** Task scheduling, Build systems, resolving dependencies.

## 5. Minimum Spanning Tree (MST)
* **Kruskal’s**
    * **Core:** Sort edges by weight + Use **DSU** to add edges without cycles.
    * **Best for:** **Sparse** graphs.
* **Prim’s**
    * **Core:** `Priority Queue`. Grow tree from a source node (like Dijkstra).
    * **Best for:** **Dense** graphs.

## 6. Social Graph Specifics
* **Trie (Prefix Tree)**
    * **Use:** Autocomplete, Spell check, String search.
    * **Time:** $O(L)$ where $L$ is word length.
* **Bloom Filter**
    * **Core:** Probabilistic data structure (Bit array + multiple hash functions).
    * **Guarantee:** Can say "Possibly in set" or "Definitely not in set".
    * **Trade-off:** Space efficient, but allows **False Positives** (never False Negatives).