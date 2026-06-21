# 📈 `std::priority_queue` & Heaps Quick Review 🚀

---

**What it is:** A container adapter that provides a **priority queue** data structure. It's built on top of other containers (like `std::vector` by default) and automatically arranges its elements such that the element with the highest (or lowest) priority is always at the "top".

**Core Benefit:** Efficiently retrieve and remove the highest (or lowest) priority element. It's typically implemented using a **heap** data structure.

---

### ✨ **Essentials & Syntax**

| Operation          | Code Example                                         | Notes                                           |
| :----------------- | :--------------------------------------------------- | :---------------------------------------------- |
| **Include** | `#include <queue>`<br>`#include <vector>`<br>`#include <functional>` | `<queue>` for `priority_queue`. `<vector>` is default underlying container. `<functional>` for `std::greater` / `std::less`. |
| **Declaration (Max-Heap - Default)** | `std::priority_queue<int> max_heap;`                 | Stores largest element at top (default behavior). |
| **Declaration (Min-Heap)** | `std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;` | Stores smallest element at top. Requires `std::vector` as underlying container and `std::greater` as comparator. |
| **Heapify (Initialization)** | `priority_queue<int> pq(vec.begin(), vec.end());` | **Optimal $O(N)$ initialization** from an existing container. |
| **Add Element** | `max_heap.push(10);`<br>`min_heap.push(5);`          | Inserts element, maintaining heap property. O(log N)     |
| **Get Top Element**| `int top_val = max_heap.top();`                     | Accesses the highest (or lowest) priority element **without removing it**. O(1) |
| **Remove Top Element**| `max_heap.pop();`                                   | Removes the highest (or lowest) priority element. O(log N) |
| **Size** | `max_heap.size();`                                   | Number of elements in the queue. O(1) |
| **Is Empty?** | `max_heap.empty();`                                  | Returns `true` if no elements. O(1) |

---

### 🌳 **Heap Concepts: Max-Heap vs. Min-Heap**

A **heap** is a specialized tree-based data structure that satisfies the heap property:

* **Max-Heap:**
    * For any given node `i`, the value of node `i` is greater than or equal to the values of its children.
    * The **largest element** is always at the root (top).
    * `std::priority_queue<Type>` is a max-heap by default.

* **Min-Heap:**
    * For any given node `i`, the value of node `i` is less than or equal to the values of its children.
    * The **smallest element** is always at the root (top).
    * To create a min-heap with `std::priority_queue`, you specify `std::greater<Type>` as the comparator: `std::priority_queue<Type, std::vector<Type>, std::greater<Type>>`.

---

### ⚙️ Custom Comparator Concept (The $\text{Comp}$ Parameter)

The `Compare` parameter is the **third template argument** and is key for customizing priority, especially for non-primitive types or defining a Min-Heap. It must be a **Type** (a Functor).

**Logic Rule:** The comparator `comp(A, B)` must return `true` if **A has lower priority** than B (i.e., A should come *after* B in the sorted order).

**Min-Heap Application (Merge k Sorted Lists Example):**
We use a Min-Heap of `ListNode*` pointers, prioritizing the node with the smallest `val`.

* **Logic:** We set the comparator to return `true` if $A$'s value is **greater than** $B$'s value (`A->val > B->val`). If $A > B$, then $A$ has lower priority and sinks, causing the smallest element to rise to the top.

#### **Custom Comparator Syntax Options**

1.  **Functor (`struct`):** The classic, explicit C++ way.
    ```cpp
    struct CompareNode {
        bool operator()(ListNode* a, ListNode* b) {
            return a->val > b->val; // Returns true if a has lower priority (is larger)
        }
    };
    std::priority_queue<ListNode*, std::vector<ListNode*>, CompareNode> minHeap;
    ```
2.  **Lambda (`decltype`):** The modern C++ way.
    ```cpp
    auto comp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    std::priority_queue<ListNode*, std::vector<ListNode*>, decltype(comp)> minHeap(comp);
    ```

---

### ⚡ **Optimization: $O(N)$ Heapify vs. $O(N \log N)$ Push**

When you have a set of data ready, how you initialize the heap matters significantly for performance.

* **The Inefficient Way ($O(N \log N)$):**
    Creating an empty heap and calling `push()` for each element. This is "Top-down" building.
* **The Optimal Way ($O(N)$):**
    Passing iterators to the constructor: `priority_queue<int> pq(nums.begin(), nums.end());`.



**Why is it $O(N)$?**
It uses **Bottom-up Heapify**. Most nodes (the leaves) don't move at all. The nodes that do move (near the root) are few in number. Mathematically, the sum of heights in a tree is linear, whereas the sum of depths (used in repeated `push`) is logarithmic per element.

---

### 💡 **Key Use Cases**

* **Finding K Largest/Smallest Elements:** Efficiently maintain the K largest/smallest elements seen so far.
* **Scheduling/Task Prioritization:** Processing tasks based on their priority (e.g., operating system task scheduler).
* **Dijkstra's Algorithm / Prim's Algorithm:** Used in graph algorithms to efficiently select the next edge/vertex with the minimum cost.
* **Median Finder:** Can be used to find the median in a stream of data.

---

### 🧠 **Key Takeaways**

* `std::priority_queue` is an **adapter** (not a standalone container) built on `std::vector` by default.
* It provides **O(log N)** for `push` and `pop`, and **O(1)** for `top`.
* Default is **Max-Heap** (largest element at top).
* To get a **Min-Heap**, use `std::greater<Type>` as the third template argument.
* `top()` only *accesses*, `pop()` *removes*.
* Elements are **not sorted** in the underlying container, only the top element is guaranteed to be the highest/lowest priority.