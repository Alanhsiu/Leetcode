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

## Phase 6 — Self-review ✅
Looped build → inspect → fix several times. Findings fixed:
- **Mislabeled-source correctness bug:** files whose number matched an NC150 problem with a *different* title were wrongly inheriting that problem's slug/difficulty (so the NC150 "Valid Parentheses" / "Reconstruct Itinerary" tiles could open the wrong file). Tightened matching to require the title to agree. This exposed that `332. Coin Challenge.cpp` is really #322 Coin Change (its fn is `coinChange`) — mapped it correctly (your solution now wins over the AI one) and added an AI Reconstruct Itinerary for the freed-up #332. Net: a *true* 150/150, 0 Unknown difficulty.
- **Accessibility — duplicate h1:** cheatsheet/reference markdown carries its own `# ` heading; pages were adding a second `<h1>`. Now exactly **one h1 on all 244 pages** (page h1 only when content lacks one; extra content h1s demoted to h2).
- Simplified the mobile-menu toggle; it now also closes on link tap.
- Verified: `astro check` 0 errors; build 244 pages; link checker 8476 links, 0 broken; `viz-test` all 18 render every frame; preview server serves every sampled route 200; no `<img>` without `alt`; reduced-motion CSS present; search index = 217 docs (188 problems + 18 cheat sheets + 11 reference).

## Phase 7 — Docs & handoff ✅
- `README.md` (architecture, run, add-a-note, CI/CD + the one-time Pages setting), `PLAN.md`, this log, and `NEEDS_REVIEW.md` (36 AI items + copyright notes + the mislabel decisions) all written.

---

## SUMMARY

Rebuilt the repo into an Astro 5 + TypeScript static site driven entirely by the four read-only content folders (never modified). **188 problems** rendered (152 of your C++ solutions + 36 AI-authored for full **150/150** NeetCode coverage), 18 cheat sheets, 11 C++ references, and **18 interactive, animated visualizations** auto-embedded per pattern. Full-text search, pattern/difficulty/status filters, cram mode, and localStorage progress + dashboard. CI checks every PR (type-check, viz smoke test, build, link-check); pushing to `main` builds and deploys to Pages. Build is green throughout; `main` untouched.

### What to look at first
1. `/` then `/visualizations` — the animation library (play/pause/step).
2. `/neetcode150` — the 150 grid; AI-covered tiles show a "⚠ AI-generated" badge on their page.
3. A problem page, e.g. `/problems/1-two-sum` (your note + embedded viz) and `/problems/56-merge-intervals` (an AI-generated one).
4. `NEEDS_REVIEW.md` — the 36 AI solutions to verify + two mislabeled source files.

### Preview locally
```bash
npm install        # approve esbuild + sharp install scripts if prompted
npm run dev        # http://localhost:4321/Leetcode/
# or the production build:
npm run build && npm run preview
```

### Go live (your move — I did NOT touch main)
1. Review this branch; merge `redesign` → `main`:
   ```bash
   git checkout main && git merge redesign && git push origin main
   ```
2. One-time: repo **Settings → Pages → Build and deployment → Source = "GitHub Actions"** (replaces the old gh-pages deploy).
3. The `deploy.yml` workflow then builds + publishes to https://alanhsiu.github.io/Leetcode/ on that push and on every future push to `main` — including when you just drop a new note file into one of the four folders.

---
---

# PART A/B/C — Online IDE + Multi-Track Learning Platform

Branch `feature/online-ide-and-learning`. New work atop the finished site above. Build
stays green; `main` untouched; the four content folders stay read-only.

## Phase 8 — Plan & provider spike ✅
- Re-explored the architecture (content pipeline, code rendering, layout, nav, CI).
  Baseline verified green: `astro check` 0 errors, build 244 pages, link-check
  8476 links / 0 broken.
- **Confirmed the execution provider against live endpoints (the brief said to check
  first):** the public **Piston** API (`emkc.org`) is now **whitelist-only (HTTP 401,
  as of 2026-02-15)** — unusable, and self-hosting is disallowed (no backend). Probed
  alternatives: **Wandbox** sends `Access-Control-Allow-Origin: *` and runs C++/Python/JS
  uniformly (verified hello-world per language, stdin honored, via a `text/plain`
  no-preflight POST); **Godbolt** is CORS-friendly but can't execute JavaScript.
- **Decision:** default provider **Wandbox**, behind a swappable abstraction, with
  `godbolt` (C++ alt) and `piston` (self-host/whitelist) adapters. Logged in
  `NEEDS_REVIEW.md`.
- Wrote `PLAN.md` (Parts A/B/C, provider rationale, phases).

## Phase 9 — Code-runner core (Part A.1) ✅
- `src/lib/runner.ts`: one public `runCode({ language, version?, files, stdin? })`
  behind a `Provider` interface. Adapters: **wandbox** (default), **piston**
  (configurable `PISTON_BASE` for self-host/whitelist). Backend swap = edit the one
  `RUNNER` config object. Normalized `RunResult` (stdout/stderr/exit/signal/compile
  message/elapsed); typed `RunnerError` + `friendlyError()`; 45s abort timeout.
  Wandbox calls use `Content-Type: text/plain` to avoid a CORS preflight.
- `scripts/runner-test.mjs`: 10 hermetic tests (mocked `fetch`) covering request
  shaping (compiler ids, options, stdin), result normalization, error mapping, and a
  provider swap. Wired into `package.json` + `ci.yml`. CI never calls the real API.

## Phase 10 — `<CodeRunner>` + CodeMirror 6 (Part A.2) ✅
- `src/components/CodeRunner.astro`: editor + optional stdin + Run/Reset + output pane
  (stdout / stderr / compiler messages / exit code / elapsed / provider). A `<textarea>`
  is the no-JS fallback, progressively enhanced to **CodeMirror 6**, which is lazy
  `import()`-ed (a 636K chunk that loads only when an editor first scrolls into view —
  collapsed playgrounds don't pay for it). Theme-synced to the site toggle, debounced
  (Run disabled in-flight), `aria-live` output, ⌘/Ctrl+↵ to run. Chose CodeMirror over
  Monaco: ~10× smaller, tree-shakeable, no worker/CDN — right for a static island.
- `src/scripts/code-editor.ts`: thin CM6 factory (lang modes for cpp/python/js, one-dark
  in dark mode, run keybinding).
- `/playground` page with C++/Python/JS runners (added to nav). Build 245 pages green;
  8988 links / 0 broken; CodeMirror confirmed code-split out of the global bundle.

## Phase 11 — Auto-driver + problem playgrounds (Part A.3) ✅
- `src/lib/driver.ts`: parses the first **top-level** public method of `class Solution`
  (brace-depth aware, so nested `struct`s like Word Search II's Trie don't confuse it)
  and synthesizes a self-contained program: portable-header harness + standard
  `TreeNode`/`ListNode` defs & builders (added only when referenced and not already
  defined) + a `main()` that builds **sample** inputs, calls the method, and prints the
  result (generic `_lcPrint`, plus level-order tree / list printers). Unsupported
  signatures (design-style `Solution` with a constructor, `vector<ListNode*>`, custom
  `Node*`) fall back to a *compiling* stub. Everything is unverified → flagged.
- Verified locally with `clang++` (offline): **all 132 runnable drivers compile and
  run** (Two Sum → `[1, 0]`, level-order → `[[3], [9, 20], [15, 7]]`, reverse list →
  `[5, 4, 3, 2, 1]`); 20 of 152 fall back to stubs. Fixed 6 real bugs found this way
  (missing headers, `vector<ListNode*>` misclassification, nested-struct parsing,
  design-class construction).
- `scripts/driver-test.mjs`: hermetic structural test over the corpus (no compiler/
  network needed) — no throws, exactly one `main()`, no duplicate type defs; wired into
  `package.json` + `ci.yml`.
- Problem pages gained a collapsible **"▶ Run it"** `<CodeRunner>` (solution + driver),
  lazy-mounted on open. Build 245 pages green; 8988 links / 0 broken.

## Phase 12 — Learning platform core (Part B.1) ✅
- New content type **guide** via Astro 5 **Content Layer** (`src/content.config.ts`,
  `glob` over `content/learning/**/*.{md,mdx}`, zod-validated frontmatter). Added
  `@astrojs/mdx` (v4, Astro-5 compatible) + dual-theme Shiki so guide code blocks match
  the site; `@/*` tsconfig alias for component imports from content.
- `src/data/tracks.ts` (track registry + humanized-folder fallback) and
  `src/lib/learning.ts` (groups guides into tracks, derives track from folder, treats
  `<track>/index.md` as the landing). Zero-wiring: drop a file → guide appears; drop a
  folder → new track.
- Routes: `/learning` (hub), `/learning/<track>` (landing + auto outline/TOC),
  `/learning/<track>/<guide>` (rendered guide + prev/next). **Learning** added as a
  distinct top-level nav section beside the existing Coding-Interview items.
- Reuse wiring: `LevelBadge` (reuses badge palette), `Viz` (embed any visualization in a
  guide via the same lazy loader), guides added to `/search-index.json`, progress
  tracking via slug-keyed `progress.ts` (`guide/<id>` keys) + dots on track outlines.
- Seed content (all `aiGenerated: true`): Temporal/Mender/GCP landings + one starter
  guide each; the Temporal guide is `.mdx` and embeds a `<CodeRunner>` (Python) to prove
  component-in-guide works; the GCP guide uses read-only `gcloud` blocks (no fake runs).
- Build 252 pages green; 9679 links / 0 broken; typecheck clean.
