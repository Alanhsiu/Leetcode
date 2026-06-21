# 📜 `lower_bound` & `upper_bound` Guide 🚀

---

**What it is:** A pair of highly efficient binary search algorithms from the C++ `<algorithm>` library. They operate on **any sorted range** (like a sorted `vector`, a `map`, or a `set`) to find the position of elements.

**Core Benefit:** Guaranteed **O(log N)** time complexity for finding elements or insertion points in sorted sequences, which is vastly superior to a linear search.

---

### ✨ **Essentials & Syntax**

| Operation | Code Example | Notes |
| :--- | :--- | :--- |
| **Include** | `#include <algorithm>` | Required for the global functions. |
| **`lower_bound`** | `auto it = std::lower_bound(vec.begin(), vec.end(), val);` | Finds iterator to the **first element >= `val`**. |
| **`upper_bound`** | `auto it = std::upper_bound(vec.begin(), vec.end(), val);` | Finds iterator to the **first element > `val`**. |
| **Member Func.** | `auto it = myMap.lower_bound(key);` | For `map` & `set`. More efficient than the global version. |
| **Get Index** | `auto idx = std::distance(vec.begin(), it);` | Converts an iterator to a zero-based index. |
| **Check Found** | `if (it != vec.end() && *it == val) { ... }` | How to check if `lower_bound` found an exact match. |

---

### 🔄 **Common Usage: Practical Examples**

These functions are versatile for querying sorted data.

* **Find Insertion Point in a Sorted `vector`:** Determines where to insert a new element to maintain order.
    ```cpp
    std::vector<int> data = {10, 20, 40, 50};
    int new_val = 30;
    
    // Find the correct position for 30
    auto insert_pos_it = std::lower_bound(data.begin(), data.end(), new_val);
    
    data.insert(insert_pos_it, new_val);
    // data is now {10, 20, 30, 40, 50}
    ```

* **Count Occurrences in a Sorted Range:** Efficiently count how many times a value appears.
    ```cpp
    std::vector<int> scores = {80, 85, 90, 90, 90, 100};
    
    auto first = std::lower_bound(scores.begin(), scores.end(), 90);
    auto last = std::upper_bound(scores.begin(), scores.end(), 90);
    
    auto count = std::distance(first, last);
    // count is 3
    ```

* **Find a Range of Keys in a `map`:** Get all key-value pairs within a specific range.
    ```cpp
    std::map<std::string, int> products;
    products["apple-fuji"] = 10;
    products["apple-gala"] = 12;
    products["banana-y"] = 20;
    
    // Find all products starting with "apple"
    auto start_it = products.lower_bound("apple");
    auto end_it = products.lower_bound("applf"); // "applf" is just after "apple"
    
    // Iterates through "apple-fuji" and "apple-gala"
    for (auto it = start_it; it != end_it; ++it) {
        // ... process pair
    }
    ```

---

### 💡 **Key Use Cases**

* **Searching Sorted Arrays:** The canonical use case for checking existence or finding an element.
* **Maintaining Sorted Collections:** Finding the correct insertion point in `O(log N)`.
* **Implementing Range Queries:** Finding all data between a start and end value (e.g., all events between two dates).
* **Counting Elements:** A fast way to count elements with a specific value in a sorted sequence.

---

### 🧠 **Key Takeaways**

* **Prerequisite:** The range **MUST be sorted** for the algorithm to work correctly. `map` and `set` are always sorted by default.
* **Mnemonics:** Remember `lower_bound` as "greater than or **equal** to" (`>=`) and `upper_bound` as "strictly **greater** than" (`>`).
* **Return Value:** The functions return an **iterator**, not a value or an index. You must dereference the iterator (`*it`) to get the value.
* **"Not Found":** If no element meets the criteria, the function returns the `end()` iterator of the range.
* **Efficiency:** Always use the member function versions (`myMap.lower_bound()`) for `std::map` and `std::set`, as they can be more performant.