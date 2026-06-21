// Build-time content pipeline. Reads the relocated source folders via Vite globs
// (raw file contents) and derives the site's specialized collections (coding
// problems + reference/cheat sheets). Dropping a new file into any folder makes
// it appear automatically with zero wiring. The markdown "notes" sections
// (System Design, Behavioral, Learning) use the separate Content-Layer
// collection in src/content.config.ts + src/lib/notes.ts.
import { NEETCODE_150, NEETCODE_CATEGORIES, type Difficulty } from "../data/neetcode150";
import { EXTRA_PROBLEMS } from "../data/extraProblems";
import { AI_SOLUTIONS } from "../data/aiSolutions";
import { slugify } from "./url";
import { markdownToText } from "./markdown";

// ---------- raw source imports ----------
const neetcodeRaw = import.meta.glob("/coding/neetcode-150/*.cpp", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const miscRaw = import.meta.glob("/coding/misc/*.cpp", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const cheatsheetRaw = import.meta.glob("/reference/cheatsheets/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Code-only cheat sheets (e.g. CS/OOD.cpp) are rendered as syntax-highlighted code.
const cheatsheetCodeRaw = import.meta.glob("/reference/cheatsheets/**/*.{cpp,cc,h,hpp}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const referenceRaw = import.meta.glob("/reference/cpp/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ---------- types ----------
export type ProblemSource = "neetcode" | "misc";
export type DifficultyOrUnknown = Difficulty | "Unknown";

export interface Problem {
  routeSlug: string;
  number: number;
  title: string;
  source: ProblemSource;
  code: string;
  language: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  difficulty: DifficultyOrUnknown;
  patterns: string[];
  leetcodeSlug?: string;
  leetcodeUrl?: string;
  inNeetCode150: boolean;
  aiGenerated: boolean;
  summary?: string; // original paraphrase (AI-generated coverage only)
  approach?: string; // markdown approach notes (AI-generated coverage only)
  searchText: string;
}

export interface Cheatsheet {
  slug: string; // <group>/<name>
  group: string; // CS | EDA | GPU | HW
  name: string; // file basename (display title)
  title: string;
  body: string; // raw markdown (or code for the .cpp)
  isCode: boolean;
  language: string;
  searchText: string;
}

export interface Reference {
  slug: string;
  title: string;
  body: string; // raw markdown
  searchText: string;
}

// ---------- metadata lookups ----------
const bySlug = new Map<string, { difficulty: Difficulty; category: string; slug: string; title: string }>();
const byNumber = new Map<number, { difficulty: Difficulty; category: string; slug: string; title: string }[]>();

for (const p of NEETCODE_150) {
  const entry = { difficulty: p.difficulty, category: p.category, slug: p.slug, title: p.title };
  bySlug.set(p.slug, entry);
  if (!byNumber.has(p.number)) byNumber.set(p.number, []);
  byNumber.get(p.number)!.push(entry);
}
const nc150Slugs = new Set(NEETCODE_150.map((p) => p.slug));
const ncFullBySlug = new Map(NEETCODE_150.map((p) => [p.slug, p]));

const extraBySlug = new Map<string, { difficulty: Difficulty; category: string; slug: string; title: string }>();
const extraByNumber = new Map<number, { difficulty: Difficulty; category: string; slug: string; title: string }[]>();
for (const p of EXTRA_PROBLEMS) {
  const entry = { difficulty: p.difficulty, category: p.category, slug: p.slug, title: p.title };
  extraBySlug.set(p.slug, entry);
  if (!extraByNumber.has(p.number)) extraByNumber.set(p.number, []);
  extraByNumber.get(p.number)!.push(entry);
}

// Heuristic pattern inference for problems with no curated metadata.
const PATTERN_KEYWORDS: [RegExp, string][] = [
  [/\btree|bst|binary tree|node\b/i, "Trees"],
  [/\bgraph|island|course|network|connect|alien/i, "Graphs"],
  [/\blinked list|list\b/i, "Linked List"],
  [/\bstack|calculator|parenthes|polish|nested/i, "Stack"],
  [/\bheap|priority|kth|merge k|events/i, "Heap / Priority Queue"],
  [/\btrie|prefix|word/i, "Tries"],
  [/\bsliding|window|substring|subarray sum/i, "Sliding Window"],
  [/\btwo sum|two pointer|3sum|palindrome|sorted/i, "Two Pointers"],
  [/\bbinary search|rotated|search|sqrt|insert position/i, "Binary Search"],
  [/\bdp|subsequence|maximal square|stock|paths|edit distance|robber|coin/i, "1-D Dynamic Programming"],
  [/\binterval|meeting|merge interval|backlog/i, "Intervals"],
  [/\bbit|power of two|bitwise|single number|divide/i, "Bit Manipulation"],
  [/\bmatrix|sparse|range sum|random|shuffle|spiral|rotate/i, "Math & Geometry"],
  [/\bgreedy|jump|gas|task scheduler/i, "Greedy"],
  [/\bhash|anagram|duplicate|concatenation|lucky/i, "Arrays & Hashing"],
  [/\bbacktrack|permutation|combination|subset|n-queen/i, "Backtracking"],
];

function inferPattern(title: string): string {
  for (const [re, cat] of PATTERN_KEYWORDS) {
    if (re.test(title)) return cat;
  }
  return "Arrays & Hashing";
}

// ---------- complexity parsing ----------
function parseComplexity(code: string, kind: "Time" | "Space"): string | undefined {
  const re = new RegExp(`${kind}\\s*Complexity\\s*[:=-]?\\s*(O\\s*\\([^\\n]*?\\)|O\\s*\\([^)]*\\))`, "i");
  const m = code.match(re);
  if (m) {
    const big = m[1].match(/O\s*\([^)]*\)/);
    if (big) return big[0].replace(/\s+/g, " ").trim();
  }
  return undefined;
}

const FILENAME_RE = /^(\d+)\.\s*(.+)\.cpp$/i;

function buildProblem(path: string, code: string, source: ProblemSource): Problem | null {
  const file = path.split("/").pop()!;
  const m = file.match(FILENAME_RE);
  if (!m) return null;
  const number = parseInt(m[1], 10);
  const title = m[2].trim();
  const titleSlug = slugify(title);

  // Resolve curated metadata: prefer exact title-slug match, then number match
  // whose curated title also matches (guards against mislabeled-number files).
  let meta = bySlug.get(titleSlug) ?? extraBySlug.get(titleSlug);
  if (!meta) {
    const candidates = [...(byNumber.get(number) ?? []), ...(extraByNumber.get(number) ?? [])];
    // Only accept a number match whose curated title actually agrees with the
    // file's title. A pure number match with a different title means the file
    // is mislabeled — don't let it claim another problem's slug/difficulty.
    meta = candidates.find((c) => slugify(c.title) === titleSlug);
  }

  const difficulty: DifficultyOrUnknown = meta?.difficulty ?? "Unknown";
  const category = meta?.category ?? inferPattern(title);
  const leetcodeSlug = meta?.slug ?? titleSlug;
  const inNeetCode150 = meta ? nc150Slugs.has(meta.slug) : false;

  const timeComplexity = parseComplexity(code, "Time");
  const spaceComplexity = parseComplexity(code, "Space");

  const routeSlug = `${number}-${titleSlug}`;
  const searchText = [title, `problem ${number}`, category, difficulty, code]
    .join(" ")
    .toLowerCase();

  return {
    routeSlug,
    number,
    title,
    source,
    code,
    language: "cpp",
    timeComplexity,
    spaceComplexity,
    difficulty,
    patterns: [category],
    leetcodeSlug,
    leetcodeUrl: `https://leetcode.com/problems/${leetcodeSlug}/`,
    inNeetCode150,
    aiGenerated: false,
    searchText,
  };
}

function buildAiProblem(ai: (typeof AI_SOLUTIONS)[number]): Problem | null {
  const nc = ncFullBySlug.get(ai.slug);
  if (!nc) return null; // only AI-cover known NeetCode 150 problems
  return {
    routeSlug: `${nc.number}-${ai.slug}`,
    number: nc.number,
    title: nc.title,
    source: "neetcode",
    code: ai.code,
    language: "cpp",
    timeComplexity: ai.timeComplexity,
    spaceComplexity: ai.spaceComplexity,
    difficulty: nc.difficulty,
    patterns: [nc.category],
    leetcodeSlug: ai.slug,
    leetcodeUrl: `https://leetcode.com/problems/${ai.slug}/`,
    inNeetCode150: true,
    aiGenerated: true,
    summary: ai.summary,
    approach: ai.approach,
    searchText: [nc.title, `problem ${nc.number}`, nc.category, nc.difficulty, ai.summary, ai.code]
      .join(" ")
      .toLowerCase(),
  };
}

let _problems: Problem[] | null = null;

export function getProblems(): Problem[] {
  if (_problems) return _problems;
  const out: Problem[] = [];
  const seen = new Set<string>();
  const add = (raw: Record<string, string>, source: ProblemSource) => {
    for (const [path, code] of Object.entries(raw)) {
      const p = buildProblem(path, code, source);
      if (!p) continue;
      let slug = p.routeSlug;
      // de-dup route slugs across folders (keep both, suffix the later one)
      if (seen.has(slug)) {
        slug = `${slug}-${source}`;
        p.routeSlug = slug;
      }
      seen.add(slug);
      out.push(p);
    }
  };
  add(neetcodeRaw, "neetcode");
  add(miscRaw, "misc");

  // Add AI-generated coverage for NeetCode 150 problems we have no note for.
  const coveredSlugs = new Set(out.filter((p) => p.leetcodeSlug).map((p) => p.leetcodeSlug));
  for (const ai of AI_SOLUTIONS) {
    if (coveredSlugs.has(ai.slug)) continue;
    const p = buildAiProblem(ai);
    if (!p || seen.has(p.routeSlug)) continue;
    seen.add(p.routeSlug);
    out.push(p);
  }

  out.sort((a, b) => a.number - b.number || a.title.localeCompare(b.title));
  _problems = out;
  return out;
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return getProblems().find((p) => p.routeSlug === slug);
}

/** All problems that belong to a given pattern/category name. */
export function getProblemsByPattern(category: string): Problem[] {
  return getProblems().filter((p) => p.patterns.includes(category));
}

// ---------- cheatsheets ----------
let _cheatsheets: Cheatsheet[] | null = null;

export function getCheatsheets(): Cheatsheet[] {
  if (_cheatsheets) return _cheatsheets;
  const out: Cheatsheet[] = [];
  for (const [path, body] of Object.entries({ ...cheatsheetRaw, ...cheatsheetCodeRaw })) {
    // path: /Interview Cheat Sheet/<group>/<name>.<ext>
    const parts = path.split("/");
    const file = parts.pop()!;
    const group = parts.pop()!; // immediate folder (CS/EDA/GPU/HW)
    const dot = file.lastIndexOf(".");
    const name = file.slice(0, dot);
    const ext = file.slice(dot + 1).toLowerCase();
    const isCode = ext !== "md";
    out.push({
      slug: `${slugify(group)}/${slugify(name)}`,
      group,
      name,
      title: name,
      body,
      isCode,
      language: isCode ? "cpp" : "md",
      searchText: `${name} ${group} ${markdownToText(body)}`.toLowerCase(),
    });
  }
  out.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
  _cheatsheets = out;
  return out;
}

export function getCheatsheetBySlug(slug: string): Cheatsheet | undefined {
  return getCheatsheets().find((c) => c.slug === slug);
}

export function getCheatsheetGroups(): { group: string; items: Cheatsheet[] }[] {
  const map = new Map<string, Cheatsheet[]>();
  for (const c of getCheatsheets()) {
    if (!map.has(c.group)) map.set(c.group, []);
    map.get(c.group)!.push(c);
  }
  return [...map.entries()].map(([group, items]) => ({ group, items }));
}

// ---------- reference (CommonUsage) ----------
let _reference: Reference[] | null = null;

export function getReference(): Reference[] {
  if (_reference) return _reference;
  const out: Reference[] = [];
  for (const [path, body] of Object.entries(referenceRaw)) {
    const file = path.split("/").pop()!;
    const name = file.replace(/\.md$/i, "");
    out.push({
      slug: slugify(name),
      title: name,
      body,
      searchText: `${name} ${markdownToText(body)}`.toLowerCase(),
    });
  }
  out.sort((a, b) => a.title.localeCompare(b.title));
  _reference = out;
  return out;
}

export function getReferenceBySlug(slug: string): Reference | undefined {
  return getReference().find((r) => r.slug === slug);
}

// ---------- NeetCode 150 coverage ----------
export interface CoverageEntry {
  nc: (typeof NEETCODE_150)[number];
  problem?: Problem; // our note, if one exists
}

export function getNeetCodeCoverage(): { category: string; entries: CoverageEntry[] }[] {
  const bySlugProblem = new Map<string, Problem>();
  for (const p of getProblems()) {
    if (p.leetcodeSlug && !bySlugProblem.has(p.leetcodeSlug)) bySlugProblem.set(p.leetcodeSlug, p);
  }
  return NEETCODE_CATEGORIES.map((category) => ({
    category,
    entries: NEETCODE_150.filter((n) => n.category === category).map((nc) => ({
      nc,
      problem: bySlugProblem.get(nc.slug),
    })),
  }));
}

// ---------- aggregate stats ----------
export function getStats() {
  const problems = getProblems();
  const byDifficulty: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0, Unknown: 0 };
  for (const p of problems) byDifficulty[p.difficulty]++;
  const nc150Covered = new Set(problems.filter((p) => p.inNeetCode150).map((p) => p.leetcodeSlug)).size;
  return {
    totalProblems: problems.length,
    byDifficulty,
    nc150Total: NEETCODE_150.length,
    nc150Covered,
    cheatsheets: getCheatsheets().length,
    reference: getReference().length,
    patterns: NEETCODE_CATEGORIES.length,
  };
}
