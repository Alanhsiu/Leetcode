# 🗺️ `std::unordered_map` Quick Review 🚀

---

**What it is:** A **hash table** for **key-value pairs**.
**Core Benefit:** **Average O(1)** time complexity for lookups, insertions, and deletions.

---

### ✨ **Essentials & Syntax**

| Operation        | Code Example                                         | Notes                                     |
| :--------------- | :--------------------------------------------------- | :---------------------------------------- |
| **Include** | `#include <unordered_map>`                          |                                           |
| **Declaration** | `std::unordered_map<KeyType, ValueType> myMap;`      | `KeyType` must be hashable.               |
| **Insert/Update**| `myMap["apple"] = 10;`                               | Adds if new, updates if key exists.       |
| **Access (Safe)**| `int val = myMap.at("apple");`                      | Throws `std::out_of_range` if key not found. |
| **Access (Unsafe)**| `int val = myMap["grape"];`                        | Accesses value. **WARNING:** Inserts default if key not found. |
| **Check Exist.** | `if (myMap.count("apple")) { ... }`                 | Returns `1` if key exists, `0` otherwise. |
| **Find (Iterator)**| `auto it = myMap.find("banana");`                 | Returns `iterator` or `myMap.end()`.    |
| **Delete** | `myMap.erase("apple");`                             | Removes key-value pair.                   |
| **Size** | `myMap.size();`                                      | Number of elements.                       |
| **Is Empty?** | `myMap.empty();`                                     | Returns `true` if no elements.            |
| **Iterate** | `for (const auto& pair : myMap) { ... }`            | **Order is NOT guaranteed!** |

---

### 💡 **Common Use Cases**

* **Frequency Counters:** `std::unordered_map<char, int> charCounts;`
* **Dictionaries/Caches:** Fast lookups by unique ID/name.

---

### 🧠 **Key Interview Points**

* **Performance:** Average O(1), Worst O(N) (due to collisions).
* **Order:** Elements are **NOT** stored in any particular order.
* **Requirements:** `KeyType` must be **hashable** (via `std::hash` or custom) and **equality comparable** (`operator==`).