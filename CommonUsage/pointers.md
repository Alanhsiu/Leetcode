# 👉 Pointers & Access: `&`, `*`, `->`, `.` (Ultra-Concise) 👈

---

**Purpose:** Working with variables, memory addresses, and accessing data.

---

### 📍 `&` (Address-Of Operator)

* **What it does:** Returns the **memory address** of a variable. Used to initialize pointers.
* **Example:**
    * `int myVar = 42;`
    * `int* ptr = &myVar;` (ptr now stores the memory address of myVar)

---

### 🌟 `*` (Dereference Operator)

* **What it does:** Gets the **value** stored at the memory address a pointer holds.
* **Examples:**
    * Primitive: `int x = *ptrNum;` (gets value from `ptrNum`)
    * Object: `(*ptrObj).member;` (gets object, then accesses member)

---

### 🟢 `.` (Dot Operator)

* **What it does:** Directly accesses a **member of an object** when you have the object itself (not a pointer to it).
* **Example:**
    * `MyObject obj;`
    * `obj.member = 5;`

---

### ➡️ `->` (Arrow Operator)

* **What it does:** Accesses a **member of an object directly through a pointer**. Shorthand for `(*pointer).member`.
* **Example:**
    * `ptrObj->member;`

---

### 🆚 When to Use Which (Summary)

| Operator | Used With:          | How it Works:                               |
| :------- | :------------------ | :------------------------------------------ |
| **`&`** | **Variables** | Gets the variable's memory address.         |
| **`*`** | **Pointer (any type)** | Gets the value pointer points to.           |
| **`.`** | **Actual Object** | Direct member access.                       |
| **`->`** | **Pointer to Object** | Dereferences pointer, then accesses member. |

---

### 🧠 Key Takeaways

* `&` (Address-of) vs. `*` (Dereference) are often inverse operations.
* `->` is syntactic sugar for `(*ptr).member`.
* `.` is for objects, `->` for pointers to objects.