// Supplementary factual metadata for problems that live in the read-only
// folders but are NOT part of the NeetCode 150 (mostly the `Misc/` folder).
// Same role as neetcode150.ts: numbers/titles/difficulty/slug/category are
// facts (no problem statements). Keyed lookups happen in lib/content.ts.
import type { Difficulty } from "./neetcode150";

export interface ExtraProblem {
  number: number;
  title: string;
  slug: string; // official LeetCode slug
  difficulty: Difficulty;
  category: string; // one of NEETCODE_CATEGORIES (best-fit pattern)
}

export const EXTRA_PROBLEMS: ExtraProblem[] = [];
