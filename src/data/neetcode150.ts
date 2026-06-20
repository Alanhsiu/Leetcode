export type Difficulty = "Easy" | "Medium" | "Hard";

export interface NC150Problem {
  number: number; // official LeetCode problem number
  title: string; // official LeetCode title (exact)
  slug: string; // official LeetCode slug (the URL segment, e.g. "two-sum" for leetcode.com/problems/two-sum/)
  difficulty: Difficulty;
  category: string; // exactly one of NEETCODE_CATEGORIES below
}

// The 18 NeetCode 150 categories, IN ROADMAP ORDER:
export const NEETCODE_CATEGORIES: string[] = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
];

export const NEETCODE_150: NC150Problem[] = [
  // Arrays & Hashing (9)
  { number: 217, title: "Contains Duplicate", slug: "contains-duplicate", difficulty: "Easy", category: "Arrays & Hashing" },
  { number: 242, title: "Valid Anagram", slug: "valid-anagram", difficulty: "Easy", category: "Arrays & Hashing" },
  { number: 1, title: "Two Sum", slug: "two-sum", difficulty: "Easy", category: "Arrays & Hashing" },
  { number: 49, title: "Group Anagrams", slug: "group-anagrams", difficulty: "Medium", category: "Arrays & Hashing" },
  { number: 347, title: "Top K Frequent Elements", slug: "top-k-frequent-elements", difficulty: "Medium", category: "Arrays & Hashing" },
  { number: 271, title: "Encode and Decode Strings", slug: "encode-and-decode-strings", difficulty: "Medium", category: "Arrays & Hashing" },
  { number: 238, title: "Product of Array Except Self", slug: "product-of-array-except-self", difficulty: "Medium", category: "Arrays & Hashing" },
  { number: 36, title: "Valid Sudoku", slug: "valid-sudoku", difficulty: "Medium", category: "Arrays & Hashing" },
  { number: 128, title: "Longest Consecutive Sequence", slug: "longest-consecutive-sequence", difficulty: "Medium", category: "Arrays & Hashing" },

  // Two Pointers (5)
  { number: 125, title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", category: "Two Pointers" },
  { number: 167, title: "Two Sum II - Input Array Is Sorted", slug: "two-sum-ii-input-array-is-sorted", difficulty: "Medium", category: "Two Pointers" },
  { number: 15, title: "3Sum", slug: "3sum", difficulty: "Medium", category: "Two Pointers" },
  { number: 11, title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", category: "Two Pointers" },
  { number: 42, title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", category: "Two Pointers" },

  // Sliding Window (6)
  { number: 121, title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", category: "Sliding Window" },
  { number: 3, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", category: "Sliding Window" },
  { number: 424, title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement", difficulty: "Medium", category: "Sliding Window" },
  { number: 567, title: "Permutation in String", slug: "permutation-in-string", difficulty: "Medium", category: "Sliding Window" },
  { number: 76, title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", category: "Sliding Window" },
  { number: 239, title: "Sliding Window Maximum", slug: "sliding-window-maximum", difficulty: "Hard", category: "Sliding Window" },

  // Stack (7)
  { number: 20, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", category: "Stack" },
  { number: 155, title: "Min Stack", slug: "min-stack", difficulty: "Medium", category: "Stack" },
  { number: 150, title: "Evaluate Reverse Polish Notation", slug: "evaluate-reverse-polish-notation", difficulty: "Medium", category: "Stack" },
  { number: 22, title: "Generate Parentheses", slug: "generate-parentheses", difficulty: "Medium", category: "Stack" },
  { number: 739, title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", category: "Stack" },
  { number: 853, title: "Car Fleet", slug: "car-fleet", difficulty: "Medium", category: "Stack" },
  { number: 84, title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", difficulty: "Hard", category: "Stack" },

  // Binary Search (7)
  { number: 704, title: "Binary Search", slug: "binary-search", difficulty: "Easy", category: "Binary Search" },
  { number: 74, title: "Search a 2D Matrix", slug: "search-a-2d-matrix", difficulty: "Medium", category: "Binary Search" },
  { number: 875, title: "Koko Eating Bananas", slug: "koko-eating-bananas", difficulty: "Medium", category: "Binary Search" },
  { number: 153, title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array", difficulty: "Medium", category: "Binary Search" },
  { number: 33, title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium", category: "Binary Search" },
  { number: 981, title: "Time Based Key-Value Store", slug: "time-based-key-value-store", difficulty: "Medium", category: "Binary Search" },
  { number: 4, title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", category: "Binary Search" },

  // Linked List (11)
  { number: 206, title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "Easy", category: "Linked List" },
  { number: 21, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", category: "Linked List" },
  { number: 143, title: "Reorder List", slug: "reorder-list", difficulty: "Medium", category: "Linked List" },
  { number: 19, title: "Remove Nth Node From End of List", slug: "remove-nth-node-from-end-of-list", difficulty: "Medium", category: "Linked List" },
  { number: 138, title: "Copy List with Random Pointer", slug: "copy-list-with-random-pointer", difficulty: "Medium", category: "Linked List" },
  { number: 2, title: "Add Two Numbers", slug: "add-two-numbers", difficulty: "Medium", category: "Linked List" },
  { number: 141, title: "Linked List Cycle", slug: "linked-list-cycle", difficulty: "Easy", category: "Linked List" },
  { number: 287, title: "Find the Duplicate Number", slug: "find-the-duplicate-number", difficulty: "Medium", category: "Linked List" },
  { number: 146, title: "LRU Cache", slug: "lru-cache", difficulty: "Medium", category: "Linked List" },
  { number: 23, title: "Merge k Sorted Lists", slug: "merge-k-sorted-lists", difficulty: "Hard", category: "Linked List" },
  { number: 25, title: "Reverse Nodes in k-Group", slug: "reverse-nodes-in-k-group", difficulty: "Hard", category: "Linked List" },

  // Trees (15)
  { number: 226, title: "Invert Binary Tree", slug: "invert-binary-tree", difficulty: "Easy", category: "Trees" },
  { number: 104, title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", difficulty: "Easy", category: "Trees" },
  { number: 543, title: "Diameter of Binary Tree", slug: "diameter-of-binary-tree", difficulty: "Easy", category: "Trees" },
  { number: 110, title: "Balanced Binary Tree", slug: "balanced-binary-tree", difficulty: "Easy", category: "Trees" },
  { number: 100, title: "Same Tree", slug: "same-tree", difficulty: "Easy", category: "Trees" },
  { number: 572, title: "Subtree of Another Tree", slug: "subtree-of-another-tree", difficulty: "Easy", category: "Trees" },
  { number: 235, title: "Lowest Common Ancestor of a Binary Search Tree", slug: "lowest-common-ancestor-of-a-binary-search-tree", difficulty: "Medium", category: "Trees" },
  { number: 102, title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", difficulty: "Medium", category: "Trees" },
  { number: 199, title: "Binary Tree Right Side View", slug: "binary-tree-right-side-view", difficulty: "Medium", category: "Trees" },
  { number: 1448, title: "Count Good Nodes in Binary Tree", slug: "count-good-nodes-in-binary-tree", difficulty: "Medium", category: "Trees" },
  { number: 98, title: "Validate Binary Search Tree", slug: "validate-binary-search-tree", difficulty: "Medium", category: "Trees" },
  { number: 230, title: "Kth Smallest Element in a BST", slug: "kth-smallest-element-in-a-bst", difficulty: "Medium", category: "Trees" },
  { number: 105, title: "Construct Binary Tree from Preorder and Inorder Traversal", slug: "construct-binary-tree-from-preorder-and-inorder-traversal", difficulty: "Medium", category: "Trees" },
  { number: 124, title: "Binary Tree Maximum Path Sum", slug: "binary-tree-maximum-path-sum", difficulty: "Hard", category: "Trees" },
  { number: 297, title: "Serialize and Deserialize Binary Tree", slug: "serialize-and-deserialize-binary-tree", difficulty: "Hard", category: "Trees" },

  // Tries (3)
  { number: 208, title: "Implement Trie (Prefix Tree)", slug: "implement-trie-prefix-tree", difficulty: "Medium", category: "Tries" },
  { number: 211, title: "Design Add and Search Words Data Structure", slug: "design-add-and-search-words-data-structure", difficulty: "Medium", category: "Tries" },
  { number: 212, title: "Word Search II", slug: "word-search-ii", difficulty: "Hard", category: "Tries" },

  // Heap / Priority Queue (7)
  { number: 703, title: "Kth Largest Element in a Stream", slug: "kth-largest-element-in-a-stream", difficulty: "Easy", category: "Heap / Priority Queue" },
  { number: 1046, title: "Last Stone Weight", slug: "last-stone-weight", difficulty: "Easy", category: "Heap / Priority Queue" },
  { number: 973, title: "K Closest Points to Origin", slug: "k-closest-points-to-origin", difficulty: "Medium", category: "Heap / Priority Queue" },
  { number: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium", category: "Heap / Priority Queue" },
  { number: 621, title: "Task Scheduler", slug: "task-scheduler", difficulty: "Medium", category: "Heap / Priority Queue" },
  { number: 355, title: "Design Twitter", slug: "design-twitter", difficulty: "Medium", category: "Heap / Priority Queue" },
  { number: 295, title: "Find Median from Data Stream", slug: "find-median-from-data-stream", difficulty: "Hard", category: "Heap / Priority Queue" },

  // Backtracking (9)
  { number: 78, title: "Subsets", slug: "subsets", difficulty: "Medium", category: "Backtracking" },
  { number: 39, title: "Combination Sum", slug: "combination-sum", difficulty: "Medium", category: "Backtracking" },
  { number: 46, title: "Permutations", slug: "permutations", difficulty: "Medium", category: "Backtracking" },
  { number: 90, title: "Subsets II", slug: "subsets-ii", difficulty: "Medium", category: "Backtracking" },
  { number: 40, title: "Combination Sum II", slug: "combination-sum-ii", difficulty: "Medium", category: "Backtracking" },
  { number: 79, title: "Word Search", slug: "word-search", difficulty: "Medium", category: "Backtracking" },
  { number: 131, title: "Palindrome Partitioning", slug: "palindrome-partitioning", difficulty: "Medium", category: "Backtracking" },
  { number: 17, title: "Letter Combinations of a Phone Number", slug: "letter-combinations-of-a-phone-number", difficulty: "Medium", category: "Backtracking" },
  { number: 51, title: "N-Queens", slug: "n-queens", difficulty: "Hard", category: "Backtracking" },

  // Graphs (13)
  { number: 200, title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", category: "Graphs" },
  { number: 133, title: "Clone Graph", slug: "clone-graph", difficulty: "Medium", category: "Graphs" },
  { number: 695, title: "Max Area of Island", slug: "max-area-of-island", difficulty: "Medium", category: "Graphs" },
  { number: 417, title: "Pacific Atlantic Water Flow", slug: "pacific-atlantic-water-flow", difficulty: "Medium", category: "Graphs" },
  { number: 130, title: "Surrounded Regions", slug: "surrounded-regions", difficulty: "Medium", category: "Graphs" },
  { number: 994, title: "Rotting Oranges", slug: "rotting-oranges", difficulty: "Medium", category: "Graphs" },
  { number: 286, title: "Walls and Gates", slug: "walls-and-gates", difficulty: "Medium", category: "Graphs" },
  { number: 207, title: "Course Schedule", slug: "course-schedule", difficulty: "Medium", category: "Graphs" },
  { number: 210, title: "Course Schedule II", slug: "course-schedule-ii", difficulty: "Medium", category: "Graphs" },
  { number: 684, title: "Redundant Connection", slug: "redundant-connection", difficulty: "Medium", category: "Graphs" },
  { number: 323, title: "Number of Connected Components in an Undirected Graph", slug: "number-of-connected-components-in-an-undirected-graph", difficulty: "Medium", category: "Graphs" },
  { number: 261, title: "Graph Valid Tree", slug: "graph-valid-tree", difficulty: "Medium", category: "Graphs" },
  { number: 127, title: "Word Ladder", slug: "word-ladder", difficulty: "Hard", category: "Graphs" },

  // Advanced Graphs (6)
  { number: 332, title: "Reconstruct Itinerary", slug: "reconstruct-itinerary", difficulty: "Hard", category: "Advanced Graphs" },
  { number: 1584, title: "Min Cost to Connect All Points", slug: "min-cost-to-connect-all-points", difficulty: "Medium", category: "Advanced Graphs" },
  { number: 743, title: "Network Delay Time", slug: "network-delay-time", difficulty: "Medium", category: "Advanced Graphs" },
  { number: 778, title: "Swim in Rising Water", slug: "swim-in-rising-water", difficulty: "Hard", category: "Advanced Graphs" },
  { number: 269, title: "Alien Dictionary", slug: "alien-dictionary", difficulty: "Hard", category: "Advanced Graphs" },
  { number: 787, title: "Cheapest Flights Within K Stops", slug: "cheapest-flights-within-k-stops", difficulty: "Medium", category: "Advanced Graphs" },

  // 1-D Dynamic Programming (12)
  { number: 70, title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy", category: "1-D Dynamic Programming" },
  { number: 746, title: "Min Cost Climbing Stairs", slug: "min-cost-climbing-stairs", difficulty: "Easy", category: "1-D Dynamic Programming" },
  { number: 198, title: "House Robber", slug: "house-robber", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 213, title: "House Robber II", slug: "house-robber-ii", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 5, title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 647, title: "Palindromic Substrings", slug: "palindromic-substrings", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 91, title: "Decode Ways", slug: "decode-ways", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 322, title: "Coin Change", slug: "coin-change", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 152, title: "Maximum Product Subarray", slug: "maximum-product-subarray", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 139, title: "Word Break", slug: "word-break", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 300, title: "Longest Increasing Subsequence", slug: "longest-increasing-subsequence", difficulty: "Medium", category: "1-D Dynamic Programming" },
  { number: 416, title: "Partition Equal Subset Sum", slug: "partition-equal-subset-sum", difficulty: "Medium", category: "1-D Dynamic Programming" },

  // 2-D Dynamic Programming (11)
  { number: 62, title: "Unique Paths", slug: "unique-paths", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 1143, title: "Longest Common Subsequence", slug: "longest-common-subsequence", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 309, title: "Best Time to Buy and Sell Stock with Cooldown", slug: "best-time-to-buy-and-sell-stock-with-cooldown", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 518, title: "Coin Change II", slug: "coin-change-ii", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 494, title: "Target Sum", slug: "target-sum", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 97, title: "Interleaving String", slug: "interleaving-string", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 329, title: "Longest Increasing Path in a Matrix", slug: "longest-increasing-path-in-a-matrix", difficulty: "Hard", category: "2-D Dynamic Programming" },
  { number: 115, title: "Distinct Subsequences", slug: "distinct-subsequences", difficulty: "Hard", category: "2-D Dynamic Programming" },
  { number: 72, title: "Edit Distance", slug: "edit-distance", difficulty: "Medium", category: "2-D Dynamic Programming" },
  { number: 312, title: "Burst Balloons", slug: "burst-balloons", difficulty: "Hard", category: "2-D Dynamic Programming" },
  { number: 10, title: "Regular Expression Matching", slug: "regular-expression-matching", difficulty: "Hard", category: "2-D Dynamic Programming" },

  // Greedy (8)
  { number: 53, title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "Medium", category: "Greedy" },
  { number: 55, title: "Jump Game", slug: "jump-game", difficulty: "Medium", category: "Greedy" },
  { number: 45, title: "Jump Game II", slug: "jump-game-ii", difficulty: "Medium", category: "Greedy" },
  { number: 134, title: "Gas Station", slug: "gas-station", difficulty: "Medium", category: "Greedy" },
  { number: 846, title: "Hand of Straights", slug: "hand-of-straights", difficulty: "Medium", category: "Greedy" },
  { number: 1899, title: "Merge Triplets to Form Target Triplet", slug: "merge-triplets-to-form-target-triplet", difficulty: "Medium", category: "Greedy" },
  { number: 763, title: "Partition Labels", slug: "partition-labels", difficulty: "Medium", category: "Greedy" },
  { number: 678, title: "Valid Parenthesis String", slug: "valid-parenthesis-string", difficulty: "Medium", category: "Greedy" },

  // Intervals (6)
  { number: 57, title: "Insert Interval", slug: "insert-interval", difficulty: "Medium", category: "Intervals" },
  { number: 56, title: "Merge Intervals", slug: "merge-intervals", difficulty: "Medium", category: "Intervals" },
  { number: 435, title: "Non-overlapping Intervals", slug: "non-overlapping-intervals", difficulty: "Medium", category: "Intervals" },
  { number: 252, title: "Meeting Rooms", slug: "meeting-rooms", difficulty: "Easy", category: "Intervals" },
  { number: 253, title: "Meeting Rooms II", slug: "meeting-rooms-ii", difficulty: "Medium", category: "Intervals" },
  { number: 1851, title: "Minimum Interval to Include Each Query", slug: "minimum-interval-to-include-each-query", difficulty: "Hard", category: "Intervals" },

  // Math & Geometry (8)
  { number: 48, title: "Rotate Image", slug: "rotate-image", difficulty: "Medium", category: "Math & Geometry" },
  { number: 54, title: "Spiral Matrix", slug: "spiral-matrix", difficulty: "Medium", category: "Math & Geometry" },
  { number: 73, title: "Set Matrix Zeroes", slug: "set-matrix-zeroes", difficulty: "Medium", category: "Math & Geometry" },
  { number: 202, title: "Happy Number", slug: "happy-number", difficulty: "Easy", category: "Math & Geometry" },
  { number: 66, title: "Plus One", slug: "plus-one", difficulty: "Easy", category: "Math & Geometry" },
  { number: 50, title: "Pow(x, n)", slug: "powx-n", difficulty: "Medium", category: "Math & Geometry" },
  { number: 43, title: "Multiply Strings", slug: "multiply-strings", difficulty: "Medium", category: "Math & Geometry" },
  { number: 2013, title: "Detect Squares", slug: "detect-squares", difficulty: "Medium", category: "Math & Geometry" },

  // Bit Manipulation (7)
  { number: 136, title: "Single Number", slug: "single-number", difficulty: "Easy", category: "Bit Manipulation" },
  { number: 191, title: "Number of 1 Bits", slug: "number-of-1-bits", difficulty: "Easy", category: "Bit Manipulation" },
  { number: 338, title: "Counting Bits", slug: "counting-bits", difficulty: "Easy", category: "Bit Manipulation" },
  { number: 190, title: "Reverse Bits", slug: "reverse-bits", difficulty: "Easy", category: "Bit Manipulation" },
  { number: 268, title: "Missing Number", slug: "missing-number", difficulty: "Easy", category: "Bit Manipulation" },
  { number: 371, title: "Sum of Two Integers", slug: "sum-of-two-integers", difficulty: "Medium", category: "Bit Manipulation" },
  { number: 7, title: "Reverse Integer", slug: "reverse-integer", difficulty: "Medium", category: "Bit Manipulation" },
];
