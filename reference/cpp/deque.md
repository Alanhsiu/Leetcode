# ⚙️ Sequence Containers & Adapters: Deque, Queue, Stack 🚀

---

**Core Concepts:**
* **Sequence Containers:** `std::vector`, `std::list`, `std::deque`, etc., providing direct management and operation interfaces for elements.
* **Container Adapters:** `std::queue` and `std::stack`, which **do not store elements directly**. They restrict the interface of an underlying container (defaulting to `std::deque`) to enforce specific data structure behaviors (FIFO or LIFO).

---

### 🌊 `std::deque` (Double-Ended Queue)

`std::deque` is a well-balanced C++ container, supporting **fast random access** while offering highly efficient operations at **both ends**.

| Operation | Code Example | Time Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Include** | `#include <deque>` | | |
| **Declaration** | `std::deque<int> dq;` | | |
| **Size/Empty** | `dq.size();`<br/>`dq.empty();` | **O(1)** | |
| **Random Access** | `int val = dq[2];` | **O(1)** | Fast, but slightly slower constant factor than `std::vector`. |
| **Front Insertion** | `dq.push_front(42);` | **O(1)** | Key advantage. |
| **Back Insertion** | `dq.push_back(100);` | **O(1)** | |
| **Front Deletion** | `dq.pop_front();` | **O(1)** | Key advantage; returns `void`. |
| **Back Deletion** | `dq.pop_back();` | **O(1)** | Returns `void`. |
| **Get Front/Back** | `dq.front();`<br/>`dq.back();` | **O(1)** | Returns element reference, doesn't remove. |
| **Clear** | `dq.clear();` | O(N) | |

---

### 🧊 `std::queue` (FIFO - First-In, First-Out)

`std::queue` is an adapter that limits the underlying container (defaulting to `std::deque`) to enforce **FIFO** order.

* **Underlying Container:** Defaults to `std::deque`; `std::list` is also usable.
* **Operation Restriction:** Can only **`push`** (enqueue) from the **back** and **`pop`** (dequeue) from the **front**.

| Operation | Code Example | Time Complexity | Behavior |
| :--- | :--- | :--- | :--- |
| **Include** | `#include <queue>` | | |
| **Declaration (Default)** | `std::queue<int> q1;` | | Uses `std::deque` as the underlying container. |
| **Enqueue** | `q1.push(42);` | **O(1)** | Adds element to the **back**. |
| **Dequeue** | `q1.pop();` | **O(1)** | Removes element from the **front** (returns `void`). |
| **Peek Front** | `int val = q1.front();` | **O(1)** | Gets the oldest element (first-in). |
| **Peek Back** | `int val = q1.back();` | **O(1)** | Gets the newest element (last-in). |
| **Empty/Size** | `q1.empty();`<br/>`q1.size();` | **O(1)** | |

---

### 🧱 `std::stack` (LIFO - Last-In, First-Out)

`std::stack` is an adapter that limits the underlying container (defaulting to `std::deque`) to enforce **LIFO** order.

* **Underlying Container:** Defaults to `std::deque`; `std::vector` or `std::list` are also options.
* **Operation Restriction:** Operations (`push`, `pop`, `top`) are only allowed at the **same end** (the top).

| Operation | Code Example | Time Complexity | Behavior |
| :--- | :--- | :--- | :--- |
| **Include** | `#include <stack>` | | |
| **Declaration (Default)** | `std::stack<int> s1;` | | Uses `std::deque` as the underlying container. |
| **Push** | `s1.push(42);` | **O(1)** | Adds element to the **top** (back). |
| **Pop** | `s1.pop();` | **O(1)** | Removes element from the **top** (returns `void`). |
| **Peek Top** | `int val = s1.top();` | **O(1)** | Gets the newest element (last-in). |
| **Empty/Size** | `s1.empty();`<br/>`s1.size();` | **O(1)** | |

---

### 🔄 Adapter Summary: Deque's Role

`std::deque` is the **default backing container** for both `std::queue` and `std::stack` because it provides **O(1)** time complexity for both **front and back operations**, satisfying the performance requirements of both FIFO (Queue) and LIFO (Stack) data structures simultaneously.

| Feature | `std::vector` | `std::deque` | `std::list` | Suitability |
| :--- | :--- | :--- | :--- | :--- |
| **Front O(1) Ops** | No (O(N)) | **Yes** | **Yes** | Required by Queue/Stack. |
| **Back O(1) Ops** | Yes (Amortized) | **Yes** | **Yes** | Required by Queue/Stack. |
| **Random Access** | **Fast (O(1))** | **Fast (O(1))** | Slow (O(N)) | `deque` maintains this advantage. |
| **As Adapter Base** | Good for `stack` | **Default/Best Balance** | Good for Queue/Stack | |