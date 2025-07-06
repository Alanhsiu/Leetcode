# 🧩 `std::unordered_set` Quick Review 🚀

---

**What it is:** A hash table that stores **unique elements** (no key-value pairs). It's like a mathematical set.

**Core Benefit:** Extremely fast **average O(1)** time complexity for insertion, deletion, and checking if an element exists.

---

### ✨ **Essentials & Syntax**

| Operation          | Code Example                                         | Notes                                           |
| :----------------- | :--------------------------------------------------- | :---------------------------------------------- |
| **Include** | `#include <unordered_set>`                          |                                                 |
| **Declaration** | `std::unordered_set<int> mySet;`                     | Stores unique integers. `Type` must be hashable.|
| **Add Element** | `mySet.insert(10);`                                  | Adds 10. If 10 already exists, no change.       |
|                    | `mySet.insert(20);`                                  |                                                 |
|                    | `mySet.insert(10);`                                  | No effect, 10 is already there.                 |
| **Check Existence**| `if (mySet.count(10)) { ... }`                     | Returns `1` if element exists, `0` otherwise.   |
|                    | `auto it = mySet.find(20);`                         | Returns iterator to element or `mySet.end()`.   |
| **Delete Element** | `mySet.erase(10);`                                   | Removes 10 from the set.                        |
| **Size** | `mySet.size();`                                      | Number of unique elements.                      |
| **Is Empty?** | `mySet.empty();`                                     | Returns `true` if no elements.                  |
| **Clear All** | `mySet.clear();`                                     | Removes all elements.                           |
| **Iteration** | `for (int x : mySet) { /* use x */ }`                | **Order is NOT guaranteed!** (Depends on hash table). |

---

### 💡 **Key Use Cases**

* **Storing Unique Items:** When you need a collection of distinct elements and don't care about their order.
    * *Example:* Collecting all unique words from a document.
* **Fast Membership Testing:** Quickly check if an element is part of a collection.
    * *Example:* `if (allowedUsers.count("Alice")) { ... }`
* **Removing Duplicates:** Efficiently filter out duplicates from a list.
    * *Example:* Copying `std::vector` elements into an `unordered_set` will automatically remove duplicates.

---

### 🧠 **Key Differences from `std::set`**

| Feature      | `std::unordered_set`        | `std::set`                  |
| :----------- | :-------------------------- | :-------------------------- |
| **Order** | **No specific order** | **Sorted by element value** |
| **Structure**| Hash Table                  | Balanced Binary Search Tree |
| **Complexity**| **Avg O(1)**, Worst O(N) | **O(log N)** (guaranteed)   |
| **Element Req.** | Hashable & Equality Comparable (`==`) | LessThanComparable (`<`)    |