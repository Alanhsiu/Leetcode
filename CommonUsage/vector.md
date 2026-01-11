# 📏 `std::vector` Quick Review 🚀

---

**What it is:** A dynamic array in C++. It's a sequence container that can change its size during runtime. Elements are stored in **contiguous memory locations**, allowing for efficient random access.

**Core Benefit:** Flexible size, efficient random access (O(1)), and cache-friendly due to contiguous storage.

---

### ✨ **Essentials & Syntax**

| Operation                  | Code Example                                                                                                                                                      | Notes                                                                           |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Include**                | `#include <vector>`<br>`#include <algorithm>`                                                                                                                     | `<algorithm>` for `std::sort`.                                                  |
| **Declaration**            | `std::vector<int> vec1;`                                                                                                                                          | Empty vector.                                                                   |
|                            | `std::vector<int> vec2(5);`                                                                                                                                       | 5 elements, default-initialized (e.g., 0).                                      |
|                            | `std::vector<int> vec3(3, 100);`                                                                                                                                  | 3 elements, all initialized to 100.                                             |
| **Add Element**            | `vec1.push_back(42);`                                                                                                                                             | Adds to end. May reallocate memory.                                             |
| **Insert Element**         | `vec1.insert(vec1.begin() + 2, 99);`                                                                                                                              | Inserts 99 at index 2. Shifts elements right. O(N) complexity.                  |
|                            | `vec1.insert(vec1.begin() + 1, 3, 100);`                                                                                                                          | Inserts 3 copies of 100 starting at index 1.                                    |
|                            | `vec1.insert(vec1.end(), otherVec.begin(), otherVec.end());`                                                                                                      | Inserts range from another vector at the end.                                   |
| **Access (Safe)**          | `int val = vec1.at(0);`                                                                                                                                           | Throws `std::out_of_range` if index invalid.                                    |
| **Access (Unsafe)**        | `int val = vec1[0];`                                                                                                                                              | No bounds check. Faster, but dangerous.                                         |
| **Get First/Last Element** | `int val = vec1.front();`<br/> `int val = vec1.back();`                                                                                                           | Returns reference to first/last element. Requires non-empty vector.             |
| **Get Size**               | `vec1.size();`                                                                                                                                                    | Number of elements currently in vector.                                         |
| **Is Empty?**              | `vec1.empty();`                                                                                                                                                   | Returns `true` if no elements.                                                  |
| **Get Capacity**           | `vec1.capacity();`                                                                                                                                                | Total allocated memory slots.                                                   |
| **Resize vs Reserve**      | `vec.resize(n);` and `vec.reserve(n);`                                                                                                                     | `reserve` only changes capacity. `resize` changes size/initializes; `resize(n, val)` initializes new elements to `val`.             |
| **Remove Last**            | `vec1.pop_back();`                                                                                                                                                | Removes last element.                                                           |
| **Remove Range**           | `vec1.erase(vec1.begin() + 1);`                                                                                                                                   | Removes element at index 1.                                                     |
|                            | `vec1.erase(vec1.begin(), vec1.begin() + 3);`                                                                                                                     | Removes elements from index 0 to 2 (exclusive).                                 |
| **Clear All**              | `vec1.clear();`                                                                                                                                                   | Removes all elements, size becomes 0.                                           |
| **Iteration**              | `for (int x : vec1) { /* use x */ }`                                                                                                                              | Range-based for loop (preferred).                                               |
|                            | `for (auto it = vec1.begin(); it != vec1.end(); ++it) { /* use *it */ }`                                                                                          | Iterator-based.                                                                 |
| **Sort**                   | `std::sort(vec1.begin(), vec1.end());`                                                                                                                            | Sorts elements in ascending order.                                              |
|                            | `std::sort(vec1.begin(), vec1.end(), std::greater<int>());`                                                                                                       | Sorts in descending order (custom comparator).                                  |
|                            | `std::sort(vecOfVecs.begin(), vecOfVecs.end(), [](const auto& a, const auto& b){ return a[0] < b[0]; });`                                                         | Sorts a vector of vectors by the first element.                                 |
|                            | `bool compareVecs(const std::vector<int>& a,const std::vector<int>& b) {return a[0] < b[0]; }`<br/> `std::sort(vecOfVecs.begin(), vecOfVecs.end(), compareVecs);` | Sorts with a **custom comparator struct** (here, by second element descending). |

---

### 🔄 **Common Usage: Copying Vectors**

Vectors handle deep copying automatically, and you can easily copy specific ranges too.

- **Copy Constructor (Full Copy on Init):** Creates a _new_ vector as a full copy.
  `std::vector<int> original = {1, 2, 3};`
  `std::vector<int> copy1 = original; // copy1 is now {1, 2, 3}`

- **Copy Assignment Operator (`=`):** Assigns contents of one vector to another existing one.
  `std::vector<int> source = {10, 20, 30};`
  `std::vector<int> destination;`
  `destination = source; // destination is now {10, 20, 30}`

- **Initialize with Range (Copying Specific Range on Init):** Creates a _new_ vector initialized with a specific range of elements from another.
  ```cpp
  std::vector<int> src = {1, 2, 3, 4, 5};
  // Copy elements from index 1 (value 2) up to (but not including) index 4 (value 5)
  std::vector<int> dest(src.begin() + 1, src.begin() + 4);
  // dest is now {2, 3, 4}
  ```

---

### 💡 **Key Use Cases**

- **Dynamic Lists:** When you need a list of items that can grow or shrink.
- **Sequential Data:** Storing data where order matters and elements are accessed by index.
- **Function Arguments/Returns:** Passing collections of data efficiently.

---

### 🧠 **Key Takeaways**

- **Dynamic Size:** Grows/shrinks as needed.
- **Contiguous Memory:** Elements are next to each other in memory, great for cache performance.
- **Reallocation Cost:** `push_back` may reallocate; use `reserve(n)` to pre-allocate capacity. `resize(n)` changes size and value-initializes new elements.
- **Random Access:** `O(1)` access time using `[]` or `at()`.
- **Insertion/Deletion:** `O(N)` for elements in the middle (requires shifting subsequent elements), `O(1)` amortized for `push_back`/`pop_back`.
