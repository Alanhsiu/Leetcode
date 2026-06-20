// Shape for AI-generated NeetCode 150 coverage (problems with no note of mine).
// These are authored by the build agent and are UNVERIFIED — every entry is
// surfaced with an "AI-generated" badge and listed in NEEDS_REVIEW.md.
// `slug` must exactly match the official LeetCode slug used in neetcode150.ts.
export interface AiSolution {
  slug: string;
  summary: string; // 1-2 sentence ORIGINAL paraphrase of the task (not LeetCode's text)
  approach: string; // short markdown explaining the approach
  code: string; // C++ solution
  timeComplexity: string; // e.g. "O(n)"
  spaceComplexity: string; // e.g. "O(1)"
}
