# NEEDS REVIEW

Items the repo owner should verify. Three classes: (A) AI-generated content I wrote and have **not** verified, (B) copyright-sensitive surfaces, (C) source-data quirks / decisions.

## A. AI-generated content (`aiGenerated: true`)
These 36 NeetCode 150 problems had no note of yours, so the build agent authored an
**original short summary + an approach + a C++ solution** for each. They are tagged
`aiGenerated: true`, badged "⚠ AI-generated" on the site, and were **NOT executed
against the LeetCode judge** — verify correctness before trusting them. Each links as
`/problems/<number>-<slug>`.

**Arrays & Hashing / Two Pointers / Sliding Window / Stack / Binary Search**
- 242 Valid Anagram · 347 Top K Frequent Elements · 271 Encode and Decode Strings · 238 Product of Array Except Self
- 424 Longest Repeating Character Replacement · 239 Sliding Window Maximum (monotonic deque)
- 853 Car Fleet
- 704 Binary Search · 875 Koko Eating Bananas (binary search on answer) · 981 Time Based Key-Value Store

**Linked List / Trees / Heap**
- 287 Find the Duplicate Number (Floyd cycle) · 297 Serialize and Deserialize Binary Tree
- 703 Kth Largest Element in a Stream · 973 K Closest Points to Origin · 355 Design Twitter · 295 Find Median from Data Stream (two heaps)

**Graphs / Advanced Graphs**
- 286 Walls and Gates (multi-source BFS) · 323 Number of Connected Components · 261 Graph Valid Tree
- 778 Swim in Rising Water · 787 Cheapest Flights Within K Stops (Bellman-Ford)

**DP / Greedy / Intervals / Bit**
- 746 Min Cost Climbing Stairs · 322 Coin Change · 300 Longest Increasing Subsequence (O(n log n))
- 416 Partition Equal Subset Sum · 494 Target Sum · 329 Longest Increasing Path in a Matrix · 312 Burst Balloons (interval DP)
- 846 Hand of Straights · 1899 Merge Triplets to Form Target Triplet · 763 Partition Labels
- 56 Merge Intervals · 435 Non-overlapping Intervals · 1851 Minimum Interval to Include Each Query
- 268 Missing Number · 371 Sum of Two Integers (bit add)

Specific edge-case notes flagged by generation: `target-sum` guards against negative/odd
`total+target`; `non-overlapping-intervals` uses `long` sentinels; `sum-of-two-integers`
does the carry on `unsigned` to avoid signed-overflow UB; `cheapest-flights` snapshots
costs per round to enforce the stop limit. All assume LeetCode's default C++17 includes
and the standard `TreeNode` definition.

## B. Copyright
- No LeetCode problem **statements** are reproduced anywhere. Pages show only facts (number, title, difficulty, pattern), a link to the official problem, your own notes/code, and — where flagged above — my own short original summaries.
- Please confirm you're comfortable with the short original problem summaries shown on problem pages (they paraphrase the task in my own words; they are not LeetCode's text).

## C. Source-data quirks & decisions
Filenames are treated as the source of truth for problem number + title. A few source files appear mislabeled relative to the real LeetCode problem of that number; the site shows them as-named and the official-link slug may therefore not resolve. Confirm whether to relabel (in your read-only folders, which I did not touch):
- `NeetCode 150/20. Diameter of Binary Tree.cpp` — #20 on LeetCode is "Valid Parentheses"; "Diameter of Binary Tree" is #543. (There is also a separate `20. Valid Parentheses.cpp`.)
- `NeetCode 150/332. Coin Challenge.cpp` — #332 is "Reconstruct Itinerary"; "Coin Challenge" is not a standard LeetCode title.
- _(any further quirks discovered during the build are appended here)_
