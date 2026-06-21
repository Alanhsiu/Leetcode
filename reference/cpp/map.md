# 🗺️ `std::map` Quick Review 🚀

---

**What it is:** An associative container storing **key-value pairs**, where keys are always **kept in sorted order**. It's typically implemented as a balanced binary search tree (like a Red-Black Tree).

**Core Benefit:** Guaranteed **O(log N)** time complexity for most operations and automatic key sorting.

---

### ✨ **Essentials & Syntax**

| Operation          | Code Example                                         | Notes                                     |
| :----------------- | :--------------------------------------------------- | :---------------------------------------- |
| **Include** | `#include <map>`                                   |                                           |
| **Declaration** | `std::map<KeyType, ValueType> myMap;`                | `KeyType` must be LessThanComparable (`<`). |
| **Insert/Update** | `myMap["apple"] = 10;`                               | Adds if new, updates if key exists.       |
| **Access (Safe)** | `int val = myMap.at("apple");`                      | Throws `std::out_of_range` if key not found. |
| **Access (Unsafe)**| `int val = myMap["grape"];`                        | **WARNING:** Inserts default if key not found. |
| **Check Exist.** | `if (myMap.count("apple")) { ... }`                 | Returns `1` if key exists, `0` otherwise. |
| **Find (Iterator)**| `auto it = myMap.find("banana");`                 | Returns `iterator` or `myMap.end()`.    |
| **Delete** | `myMap.erase("apple");`                             | Removes key-value pair.                   |
| **Size** | `myMap.size();`                                      | Number of elements.                       |
| **Is Empty?** | `myMap.empty();`                                     | Returns `true` if no elements.            |

---

### 🚶 **Traversal Ways (Always Sorted!)**

* **Forward Order (Ascending by Key):**
    * `for (const auto& pair : myMap) { /* use pair.first, pair.second */ }`
    * Or using iterators: `for (auto it = myMap.begin(); it != myMap.end(); ++it) { /* use it->first, it->second */ }`
* **Reverse Order (Descending by Key):**
    * `for (auto it = myMap.rbegin(); it != myMap.rend(); ++it) { /* use it->first, it->second */ }`

---

### 💡 **Key Use Cases**

* When you need elements **always sorted by key** (e.g., storing data alphabetically or numerically by ID).
* When a **guaranteed O(log N)** performance for lookups, insertions, and deletions is critical, rather than average O(1) with potential worst-case O(N) (like `unordered_map`).

---

### 🧠 **Key Differences from `unordered_map`**

| Feature      | `std::map`                  | `std::unordered_map`        |
| :----------- | :-------------------------- | :-------------------------- |
| **Order** | **Sorted by key** | **No specific order** |
| **Structure**| Balanced Binary Search Tree | Hash Table                  |
| **Complexity**| **O(log N)** (guaranteed)   | **Avg O(1)**, Worst O(N) |
| **Key Req.** | LessThanComparable (`<`)    | Hashable & Equality Comparable (`==`) |