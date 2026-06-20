// Supplementary factual metadata for problems that live in the read-only
// folders but are NOT part of the NeetCode 150 (mostly the `Misc/` folder).
// Same role as neetcode150.ts: numbers/titles/difficulty/slug/category are
// facts (no problem statements). Keyed lookups happen in lib/content.ts.
import type { Difficulty } from "./neetcode150";

export interface ExtraProblem {
  number: number;
  title: string; // use the title VERBATIM
  slug: string; // official LeetCode slug
  difficulty: Difficulty;
  category: string; // one of NEETCODE_CATEGORIES (best-fit pattern)
}

export const EXTRA_PROBLEMS: ExtraProblem[] = [
  { number: 16, title: "3Sum Closest", slug: "3sum-closest", difficulty: "Medium", category: "Two Pointers" },
  { number: 29, title: "Divide Two Integers", slug: "divide-two-integers", difficulty: "Medium", category: "Bit Manipulation" },
  { number: 35, title: "Search Insert Position", slug: "search-insert-position", difficulty: "Easy", category: "Binary Search" },
  { number: 69, title: "Sqrt(x)", slug: "sqrtx", difficulty: "Easy", category: "Binary Search" },
  { number: 111, title: "Minimum Depth of Binary Tree", slug: "minimum-depth-of-binary-tree", difficulty: "Easy", category: "Trees" },
  { number: 116, title: "Populating Next Right Pointers in Each Node", slug: "populating-next-right-pointers-in-each-node", difficulty: "Medium", category: "Trees" },
  { number: 122, title: "Best Time to Buy and Sell Stock II", slug: "best-time-to-buy-and-sell-stock-ii", difficulty: "Medium", category: "Greedy" },
  { number: 123, title: "Best Time to Buy and Sell Stock III", slug: "best-time-to-buy-and-sell-stock-iii", difficulty: "Hard", category: "1-D Dynamic Programming" },
  { number: 188, title: "Best Time to Buy and Sell Stock IV", slug: "best-time-to-buy-and-sell-stock-iv", difficulty: "Hard", category: "2-D Dynamic Programming" },
  { number: 201, title: "Bitwise AND of Numbers Range", slug: "bitwise-and-of-numbers-range", difficulty: "Medium", category: "Bit Manipulation" },
  { number: 209, title: "Minimum Size Subarray Sum", slug: "minimum-size-subarray-sum", difficulty: "Medium", category: "Sliding Window" },
  { number: 221, title: "Maximal Square", slug: "maximal-square", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 224, title: "Basic Calculator", slug: "basic-calculator", difficulty: "Hard", category: "Stack" },
  { number: 227, title: "Basic Calculator II", slug: "basic-calculator-ii", difficulty: "Medium", category: "Stack" },
  { number: 231, title: "Power of Two", slug: "power-of-two", difficulty: "Easy", category: "Bit Manipulation" },
  { number: 283, title: "Move Zeroes", slug: "move-zeroes", difficulty: "Easy", category: "Two Pointers" },
  { number: 298, title: "Binary Tree Longest Consecutive Sequence", slug: "binary-tree-longest-consecutive-sequence", difficulty: "Medium", category: "Trees" },
  { number: 303, title: "Range Sum Query - Immutable", slug: "range-sum-query-immutable", difficulty: "Easy", category: "1-D Dynamic Programming" },
  { number: 305, title: "Number of Islands II", slug: "number-of-islands-ii", difficulty: "Hard", category: "Advanced Graphs" },
  { number: 307, title: "Range Sum Query - Mutable", slug: "range-sum-query-mutable", difficulty: "Medium", category: "Advanced Graphs" },
  { number: 311, title: "Sparse Matrix Multiplication", slug: "sparse-matrix-multiplication", difficulty: "Medium", category: "Math & Geometry" },
  { number: 341, title: "Flatten Nested List Iterator", slug: "flatten-nested-list-iterator", difficulty: "Medium", category: "Stack" },
  { number: 384, title: "Shuffle an Array", slug: "shuffle-an-array", difficulty: "Medium", category: "Math & Geometry" },
  { number: 399, title: "Evaluate Division", slug: "evaluate-division", difficulty: "Medium", category: "Graphs" },
  { number: 528, title: "Random Pick with Weight", slug: "random-pick-with-weight", difficulty: "Medium", category: "Binary Search" },
  { number: 696, title: "Count Binary Substrings", slug: "count-binary-substrings", difficulty: "Easy", category: "Two Pointers" },
  { number: 714, title: "Best Time to Buy and Sell Stock with Transaction Fee", slug: "best-time-to-buy-and-sell-stock-with-transaction-fee", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 986, title: "Interval List Intersections", slug: "interval-list-intersections", difficulty: "Medium", category: "Intervals" },
  { number: 1114, title: "Print in Order", slug: "print-in-order", difficulty: "Easy", category: "Math & Geometry" },
  { number: 1226, title: "The Dining Philosophers", slug: "the-dining-philosophers", difficulty: "Medium", category: "Math & Geometry" },
  { number: 1233, title: "Remove Sub-Folders from the Filesystem", slug: "remove-sub-folders-from-the-filesystem", difficulty: "Medium", category: "Tries" },
  { number: 1353, title: "Maximum Number of Events That Can Be Attended", slug: "maximum-number-of-events-that-can-be-attended", difficulty: "Medium", category: "Greedy" },
  { number: 1394, title: "Find Lucky Integer in an Array", slug: "find-lucky-integer-in-an-array", difficulty: "Easy", category: "Arrays & Hashing" },
  { number: 1462, title: "Course Schedule IV", slug: "course-schedule-iv", difficulty: "Medium", category: "Graphs" },
  { number: 1603, title: "Design Parking System", slug: "design-parking-system", difficulty: "Easy", category: "Arrays & Hashing" },
  { number: 1801, title: "Number of Orders in the Backlog", slug: "number-of-orders-in-the-backlog", difficulty: "Medium", category: "Heap / Priority Queue" },
  { number: 1865, title: "Finding Pairs With a Certain Sum", slug: "finding-pairs-with-a-certain-sum", difficulty: "Medium", category: "Arrays & Hashing" },
  { number: 1929, title: "Concatenation of Array", slug: "concatenation-of-array", difficulty: "Easy", category: "Arrays & Hashing" },
  // The file "332. Coin Challenge.cpp" is mislabeled: its function is coinChange
  // and it is actually LeetCode #322 Coin Change. Map it to the real problem so
  // the user's own solution is used (the AI-generated coin-change is then skipped).
  { number: 332, title: "Coin Challenge", slug: "coin-change", difficulty: "Medium", category: "1-D Dynamic Programming" },
];
