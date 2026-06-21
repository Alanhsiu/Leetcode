// A "Standard Solution" is a clean, canonical reference for a problem: an original
// (never copied from LeetCode) short summary, a brief approach, an idiomatic C++
// `class Solution`, and complexity. Standards are AI-authored and UNVERIFIED — every
// one is recorded in NEEDS_REVIEW.md. They are keyed by the problem's `routeSlug`
// (e.g. "1-two-sum") so they attach to exactly one problem regardless of source.
export interface StandardSolution {
  routeSlug: string;
  summary: string;        // 1-2 sentence ORIGINAL paraphrase of the task
  approach: string;       // short markdown explaining the canonical approach
  code: string;           // idiomatic C++ `class Solution`
  timeComplexity: string; // e.g. "O(n)"
  spaceComplexity: string; // e.g. "O(1)"
}
