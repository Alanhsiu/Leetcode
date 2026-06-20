# PLAN — Leetcode Interview-Prep Site Rebuild

Branch: `redesign`. Target deploy: GitHub Pages at `https://alanhsiu.github.io/Leetcode/`.

## 1. Content sources (READ-ONLY)

Four folders are content sources and are never written to:

| Folder | Files | Shape |
| --- | --- | --- |
| `NeetCode 150/` | 114 × `.cpp` | `<num>. <Title>.cpp`, a C++ `Solution` class + inline comments + `// Time/Space Complexity` footer |
| `Misc/` | 38 × `.cpp` | Same shape; extra problems beyond NC150 |
| `Interview Cheat Sheet/` | 17 × `.md` (+1 `.cpp`) | Topic cheat sheets in `CS/`, `EDA/`, `GPU/`, `HW/` |
| `CommonUsage/` | 11 × `.md` | C++ STL quick-reference docs |

Total: **152 problem solutions** + 18 cheat sheets + 11 reference docs.

## 2. Content model

At build time we **read** the four folders (never mutate them) and derive collections:

- **problem** — one per `.cpp` in `NeetCode 150/` + `Misc/`. Parsed fields:
  - `number`, `title` (from filename), `source` (`neetcode`/`misc`)
  - `code` (raw file), `language` `cpp`
  - `timeComplexity` / `spaceComplexity` (parsed from `// Time/Space Complexity:` footer when present)
  - `difficulty`, `patterns[]`, `leetcodeSlug` — from curated `src/data/` factual metadata (NC150 roadmap), with algorithmic slug fallback.
  - `aiGenerated` (true only for problems with no source note that we author a summary/solution for).
- **cheatsheet** — one per `.md` under `Interview Cheat Sheet/`, grouped by top folder (`CS`/`EDA`/`GPU`/`HW`).
- **reference** — one per `.md` in `CommonUsage/`.

Loaders use Vite `import.meta.glob(..., { query: '?raw', eager: true })` against the repo-root content folders, so **adding a new file later auto-appears** with zero wiring.

Copyright: we render only the user's own notes/code + facts (number, title, difficulty, pattern, official URL) + our own original short summaries. No LeetCode problem statements are reproduced. AI-authored summaries/solutions are tagged `aiGenerated: true` and logged in `NEEDS_REVIEW.md`.

## 3. SSG choice — Astro + TypeScript (static)

Chosen per the brief and because it fits: zero-JS-by-default static HTML (fast review), island hydration only for interactive viz/search, first-class TS, Shiki syntax highlighting built in, trivial `site`/`base` handling for project Pages, and Vite globs let us ingest arbitrary external files at build time without touching them. Output: fully static `dist/`.

- `site: 'https://alanhsiu.github.io'`, `base: '/Leetcode'`. All internal links go through `import.meta.env.BASE_URL` via a `href()` helper.
- Styling: Tailwind CSS v4 (`@tailwindcss/vite`) + small custom CSS. Dark default + light toggle (class strategy, no-flash inline script).
- Syntax highlighting: Shiki (`github-dark`/`github-light`) at build time for C++.
- Search: build a JSON index (`/search-index.json`) + client-side Fuse.js island. Filter by difficulty / pattern / source / status.
- Interactive visualizations: framework-free vanilla-TS custom elements (SVG/Canvas) with a shared base controller (play/pause/step/reset/speed), `prefers-reduced-motion` aware.

## 4. Site map

- `/` — landing: hero, stats, pattern grid, jump-in links.
- `/problems/` — searchable/filterable list of all 152 problems (quick-review cards).
- `/problems/<num>-<slug>/` — full problem note (summary, badges, complexity, highlighted code, embedded pattern viz, progress controls).
- `/patterns/<pattern>/` — all problems for a pattern + its visualization.
- `/neetcode150/` — the canonical 150 grid grouped by category, coverage + progress.
- `/visualizations/` — gallery of all algorithm animations.
- `/cheatsheets/` + `/cheatsheets/<group>/<slug>/` — rendered cheat sheets.
- `/reference/` + `/reference/<slug>/` — C++ STL reference.
- `/dashboard/` — personal progress (localStorage): solved / needs-review / confident, by pattern.
- `/cram/` — quick-review mode across everything.

## 5. Visualization library (Phase 3)

Reusable animated components, each embedded into its pattern page + relevant problems:
arrays & two pointers, sliding window, binary search, linked list, stack/queue, hashing,
trees (DFS/BFS traversals), tries, heap/priority queue, graphs (BFS, DFS, topological sort,
Dijkstra, union-find), backtracking, intervals, greedy, DP (animated table).

Each: SVG/Canvas, play/pause/step/reset + speed, captioned current step, keyboard-operable, reduced-motion fallback (renders final state, no autoplay).

## 6. CI/CD (Phase 5)

- **PR** (`.github/workflows/ci.yml`): `npm ci` → `astro check` (type-check) → `npm run build` → internal-link check (fails on broken links).
- **Push to `main`** (`.github/workflows/deploy.yml`): build → `withastro/action` → deploy Pages (`contents: read`, `pages: write`, `id-token: write`).
- Result: dropping a new file into any of the four folders and pushing to `main` rebuilds + redeploys automatically. The old Hugo `peaceiris→gh-pages` flow is replaced; Pages source switches to GitHub Actions.

## 7. Progress / review / docs

`PROGRESS.md` (chronological log + final summary), `NEEDS_REVIEW.md` (every `aiGenerated` item + copyright-sensitive + mislabeled-source notes), `README.md` (architecture, run, add-a-note, CI/CD). Branch pushed to `origin/redesign`; `main` untouched.
