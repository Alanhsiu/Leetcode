# PROGRESS

Chronological log of the `redesign` rebuild. Newest entries at the bottom of each phase.

## Phase 0 — Explore & plan ✅
- Inspected repo. Content sources: `NeetCode 150/` (114 `.cpp`), `Misc/` (38 `.cpp`), `Interview Cheat Sheet/` (18 files md+cpp, in CS/EDA/GPU/HW), `CommonUsage/` (11 `.md`).
- `.cpp` notes follow `<num>. <Title>.cpp` with C++ `Solution` + `// Time/Space Complexity` footers.
- Existing site: Hugo blog (`blog/`) deployed via `peaceiris` → `gh-pages`. `.gitmodules` only references the PaperMod blog theme.
- Node v26.3.1, npm 11.16. Remote `github.com/Alanhsiu/Leetcode`.
- Wrote `PLAN.md` (content model, Astro+TS choice, site map, viz list, CI/CD).

## Phase 1 — Architecture ✅
- Scaffolded Astro 5 + TypeScript (static) at repo root. `site` + `base: /Leetcode` set; all internal links go through a `href()` helper.
- Tailwind CSS v4 via `@tailwindcss/vite`; class-based dark mode (default dark) with no-flash inline theme script.
- Content pipeline (`src/lib/content.ts`) ingests the 4 read-only folders via Vite `import.meta.glob(?raw)` — source files untouched, new files auto-appear. Parses problem number/title/complexity; merges curated NC150 + extra metadata for difficulty/pattern/official slug.
- Shiki dual-theme C++ highlighting; `marked` for cheat-sheet/reference markdown.
- Build verified green: **208 pages**, 152 problems ingested.

## Phase 2 — Reading experience ✅
- Pages: landing, problems list (text/difficulty/pattern/status filters + sort + deep-linkable), problem detail (badges, complexity, code+copy, related, prev/next), patterns index + per-pattern, cheatsheets, reference, NeetCode 150 grid, cram mode, dashboard.
- Full-text fuzzy search overlay (Fuse.js) over `/search-index.json`, keyboard-driven (`/` to open, ↑/↓/↵/Esc). Fixed a real bug: search script can't be `define:vars` + bundled import — switched to a data-attribute.
- localStorage progress (solved/review/confident) with delegated UI, status dots everywhere, dashboard with per-pattern bars + export/reset.
- Cram mode: collapsible per-problem cards (pattern + complexity → full code), status-filterable.
- Internal link checker (`scripts/linkcheck.mjs`): **7040 links, 0 broken**. Type-check: 0 errors.
- Accessibility: skip link, focus rings, reduced-motion CSS, aria labels, keyboard nav.

## Phase 3 — Visualizations ✅
- Built a framework-free SVG visualization engine (`src/scripts/viz/base.ts`): discrete-frame stepper with play/pause/step-back/step-forward/reset, 4 speeds, a draggable progress slider, aria-live caption, keyboard control (←/→/space), focus ring, and auto-play-on-scroll that is suppressed under `prefers-reduced-motion`. Shared SVG helpers + dark/light palette in `svg.ts` + global.css.
- 18 visualizations, each code-split (lazy-loaded only where shown): two-pointers, sliding-window, binary-search, linked-list, stack, hashing, tree-traversal (DFS), trie, heap (sift up/down), graph-traversal (BFS), topological-sort (Kahn), dijkstra, union-find, backtracking (subsets), intervals (merge), greedy (jump game), dp-1d (house robber), dp-2d (LCS).
- Embedded automatically: each pattern page + every problem in a pattern shows its visualization (via `CATEGORY_VIZ`). Full gallery at `/visualizations`.
- Wrote a fake-DOM smoke test (`npm run viz-test`) that mounts each viz and steps through **every frame** — all 18 pass with 0 runtime errors. Type-check: 0 errors. Build: 208 pages, 0 broken links.

## Phase 4 — NeetCode 150 coverage ✅
- `/neetcode150` grid: all 150 grouped by the 18 patterns, each tile linking to my note or the official problem, with coverage counts, a progress bar, and live "done" counter from localStorage.
- Filled `extraProblems.ts` with factual difficulty/pattern/slug for the 38 non-NC150 problems that previously showed "Unknown" → **0 Unknown difficulty** remain (39 Easy / 124 Medium / 25 Hard across 188 problems).
- Added AI-generated coverage for the **36** NeetCode 150 problems with no note of mine: original summary + approach + C++ solution each, tagged `aiGenerated: true`, badged on-site, listed in NEEDS_REVIEW.md. **Coverage is now 150/150.**
- Total rendered problems: **188** (152 from my folders + 36 AI).

## Phase 5 — CI/CD ✅
- `.github/workflows/ci.yml` (PRs / non-main pushes): `npm ci` → `astro check` → viz smoke test → `build` → internal-link check (fails on broken links).
- `.github/workflows/deploy.yml` (push to `main`): builds with official `withastro/action` and deploys to Pages with `contents: read`, `pages: write`, `id-token: write` + concurrency. Replaces the old Hugo→gh-pages flow.
- One-time repo setting required: **Settings → Pages → Source = "GitHub Actions"** (documented in README).

## Phase 6 — Self-review
- (in progress)
