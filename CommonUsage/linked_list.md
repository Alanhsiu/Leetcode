# 🔗 Linked List Problem Solving Template 🚀

---

**What it is:** A linear data structure where elements (nodes) are not stored at contiguous memory locations. Each node points to the next node in the sequence.

**Core Benefit:** Efficient insertions and deletions at any point in the list, as it only requires updating a few pointers.

---

### ✨ **Typical Patterns & Techniques**

| Pattern/Technique | Purpose & When to Use                                                                                                                               | Code Example (Conceptual)                                       |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| **Dummy Head Node** | Simplifies list construction and head modifications by providing a consistent starting point, avoiding special-casing the first node.             | `ListNode* dummy = new ListNode(0);` <br/> `ListNode* cur = dummy;`     |
| **Two Pointers (Slow/Fast)** | Detect cycles, find middle, or locate N-th node from end. Slow moves 1x, Fast moves 2x. For N-th from end, one starts N steps ahead. | `slow = head, fast = head;` <br/> `while(fast && fast->next) { slow=slow->next; fast=fast->next->next; }` |
| **Iterative Traversal** | The most fundamental way to walk through a list node by node.                                                                               | `ListNode* cur = head;` <br/> `while (cur) { /* ... */ cur = cur->next; }` |
| **Reversing Iteratively** | A common sub-problem. Changes `A -> B -> C` to `A <- B <- C`. Requires tracking previous, current, and next nodes.                    | `prev=nullptr, cur=head;` <br/> `while(cur) { temp=cur->next; cur->next=prev; prev=cur; cur=temp; }` |

---

### 💡 **General Steps for Linked List Problems**

* **1. Understand & Draw:** Clearly define problem. **Always draw out examples** to visualize pointer changes.
* **2. Identify Core Operations:** Determine if you need to traverse, reverse, merge, split, delete, etc.
* **3. Choose Pointers:**
    * `current`: Node being processed.
    * `prev`: Node before `current` (for modifying `next` pointers).
    * `nextTemp`: Temporary to save `current->next` before modification.
    * `dummyHead`: For simplifying new list construction or head changes.
* **4. Handle Edge Cases:**
    * `nullptr` inputs (empty lists).
    * Single-node or two-node lists.
    * Operations on the first or last node.
* **5. Trace & Debug:** Mentally (or with a debugger) trace your code with drawn examples, especially pointer assignments.
* **6. Memory Management (C++):** Remember to `delete` dynamically allocated `ListNode` objects when they are no longer needed (e.g., the `dummyHead` node or deleted nodes).

---

### 🧠 **Typical `ListNode` Definition**

```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
```