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

## Phase 13 — Track content: Temporal / Mender / GCP (Part B.2) ✅
- Authored concise, structural **starter guides** (all `aiGenerated: true`, badged,
  listed in NEEDS_REVIEW.md §F):
  - **Temporal** (4): durable execution, workflows & activities, workers & task queues,
    retries & timeouts.
  - **Mender** (4): why OTA is hard / A/B updates, artifacts, deployments & device
    groups, state scripts & delta updates.
  - **GCP** (6): Cloud Run, GKE, Pub/Sub, Cloud Storage, IAM, BigQuery — the services
    named in the brief; CLI shown as **read-only** `gcloud`/`bq` blocks (never faked).
- Homepage gained a **Learning tracks** section. Updated `NEEDS_REVIEW.md` with the
  provider change (§D), the unverified auto-drivers + coverage (§E), and every
  AI-drafted guide with the official-docs to check against (§F).
- Build 263 pages green; 10024 links / 0 broken; 14 guides indexed for search.

## Phase 14 — Reuse polish across both content types (Part B.3) ✅
- **Cram**: guides now appear in `/cram` under a "📚 Learning guides" section, grouped by
  track, each collapsed to title/level/description/tags. They reuse the existing
  `data-cram`/`data-slug` machinery, so the status filter, expand/collapse-all, count,
  and empty-group hiding all work across problems **and** guides (204 cram cards total).
- **Dashboard**: added a "Learning" panel with per-track progress bars and folded guide
  "needs review" items into the review list — progress now spans both content types
  (problems keep their own overall stats; guides get their own touched% + per-track bars).
- Confirms the brief's shared surfaces (search, level badges, cram/quick-review,
  progress, visualizations) work for guides as well as problems. Build 263 pages green;
  10041 links / 0 broken.

## Phase 15 — CI/CD & docs (Part C) ✅
- **CI** (`ci.yml`) now runs, in order: `astro check` → viz smoke → **runner-test** →
  **driver-test** → `build` → link-check. Both new tests are **hermetic** (mocked fetch /
  local files) — the execution API is never called in CI or during the build. Deploy flow
  (`withastro/action` → Pages on `main`) unchanged and builds the new MDX/runner content.
- **README** rewritten: two-section overview, the runner (how it works + how to swap the
  backend to self-hosted Piston/Judge0), auto-driver caveats, how to add a guide/track,
  updated architecture tree / routes / scripts / CI. `NEEDS_REVIEW.md` covers the provider
  change, unverified drivers, and every AI-drafted guide. This log + final summary below.
- Full local suite green: check 0 errors, viz 18/18, runner 10/10, driver OK, build 263
  pages, 10041 links / 0 broken.

## Phase 16 — Self-review loop ✅
- **Real end-to-end runner test** (the brief's "a few real runs"): ran the actual
  `runCode()` client against **live Wandbox** with Two Sum's auto-generated driver →
  `[1, 0]` (exit 0) and a Python snippet → `retry demo -> 15` (exit 0). The full path
  (buildDriver → runCode → text/plain POST → normalized result) works.
- **Compile verification** (offline `clang++`): all 132 runnable drivers compile + run.
- **Dev smoke test** (`astro dev`): `/`, `/playground`, `/learning`, each track + guide,
  a problem page, `/cram`, `/dashboard` all return **200**; guide renders its
  `<CodeRunner>`, problem page has playground **+** viz, cram shows the learning section.
- **Accessibility/integrity:** exactly **one `<h1>`** on every sampled page (guides use
  `##`→h2); problem pages keep viz + code + progress + related + LeetCode link; no `<img>`
  without `alt`; reduced-motion CSS present; CodeMirror/runner add no autoplay motion.
- **Guardrails:** the four content folders are **untouched** (`git diff main...HEAD` over
  them is empty); `main` not touched.

---

## SUMMARY — Online IDE + Learning Platform (Part A/B/C)

Built on top of the existing Astro site, on `feature/online-ide-and-learning`:

- **Part A — in-page code runner.** One swappable client (`src/lib/runner.ts`,
  `runCode({language,version,files,stdin})`) with Wandbox (default) + Piston adapters —
  chosen after confirming the public Piston endpoint is now whitelist-only. A reusable
  `<CodeRunner>` (CodeMirror 6, lazy + code-split) on `/playground`, in guides, and as a
  collapsible **"▶ Run it"** on every problem page, where `src/lib/driver.ts` synthesizes
  a `main()` + sample input (132/152 runnable, the rest graceful stubs; all unverified).
- **Part B — multi-track learning platform.** A `learning` Content-Layer collection
  (`content/learning/**`, MDX) → `/learning` hub, per-track landings + outlines, and
  guide pages; **Temporal / Mender / GCP** scaffolded with 14 AI-drafted starter guides.
  Search, level badges, cram, progress, and visualizations all work across problems
  **and** guides. Adding a guide = drop a file; adding a track = drop a folder.
- **Part C — CI/CD & docs.** CI gained two **hermetic** tests (runner + driver, network
  mocked); the execution API is never called in CI/build. README, PLAN, this log, and
  NEEDS_REVIEW updated.

### What to check first
1. `/playground` — run C++, Python, JS in the browser (try the sample inputs).
2. `/problems/1-two-sum` → expand **"▶ Run it"** → Run (auto-driver prints `[1, 0]`).
   Try a tree problem too, e.g. `/problems/104-maximum-depth-of-binary-tree`.
3. `/learning` → **Temporal → "What is Durable Execution?"** (a guide that embeds a
   runnable Python snippet) and `/learning/gcp/cloud-run` (read-only `gcloud` blocks).
4. `NEEDS_REVIEW.md` §D–F — the provider change, the **unverified** auto-drivers, and
   every **AI-drafted** guide to verify against official docs.
5. `/cram` (now includes a "Learning guides" section) and `/dashboard` (per-track progress).

### Preview locally
```bash
npm install
npm run dev        # http://localhost:4321/Leetcode/   (uses the next free port if busy)
# or the production build:
npm run build && npm run preview
# checks: npm run check && npm run runner-test && npm run driver-test && npm run viz-test
#         npm run build && npm run linkcheck
```
Note: the code runner calls the public Wandbox sandbox **from your browser** at runtime;
the build, tests, and CI never call it.

### Go live (your move — `main` untouched)
```bash
git checkout main && git merge feature/online-ide-and-learning && git push origin main
```
The existing `deploy.yml` then builds + publishes to GitHub Pages. (One-time, if not
already set: repo **Settings → Pages → Source = "GitHub Actions"**.) To run code through
your own backend instead of the public sandbox, edit the `RUNNER` map in
`src/lib/runner.ts` (see README → "Swapping the execution backend").

---
---

# PART D — Discoverability + polish (branch `chore/seo-and-polish`)

A bounded, **technical-only** pass over the finished site: SEO, social cards, a11y,
performance, and polish. **No new notes/guides/problems and no new factual claims.** The
four read-only folders stayed untouched; `main` untouched; build green throughout.

## Phase 17 — Remove AI markers ✅
- Removed the on-page "⚠ AI-generated"/"⚠ AI-drafted"/"AI" badges and banners from
  problem pages, learning track + guide pages, `/cram`, and `/learning` (content was
  reviewed by the owner). Kept the actual summary/approach **content**; only the warning
  framing was dropped. Later (Phase 21) also removed the "AI-drafted and not yet verified"
  sentences from the three track-landing `index.md` files.
- The `aiGenerated` frontmatter + `aiSolutions*.ts` data remain as inert metadata;
  `NEEDS_REVIEW.md` §A/§F/§G keep the provenance record.

## Phase 18 — SEO foundation + social cards + favicons + 404 ✅
- `@astrojs/sitemap` → `/sitemap-index.xml` (OG images filtered out), linked from every
  page and in a new `public/robots.txt`.
- RSS (`@astrojs/rss`) at `/rss.xml`: learning guides + cheat sheets + reference (43 items).
- New `src/lib/seo.ts`: site identity, canonical/absolute URLs, the OG route key, the
  full page list, and JSON-LD builders — one source of truth.
- `BaseLayout` head rewritten: canonical, `og:*`/`twitter:*` (+ `og:image`),
  `og:site_name`/`og:locale`, `noindex` support, sitemap + RSS links, favicon/manifest links.
- JSON-LD: `WebSite` (home), `TechArticle` + `BreadcrumbList` (problems, guides, cheat
  sheets, reference), `BreadcrumbList` (patterns).
- Build-time OG cards via `astro-og-canvas` — `src/pages/open-graph/[...route].ts`,
  264 PNGs, bundled Inter fonts (offline/hermetic).
- Full favicon/app-icon set + `site.webmanifest` from one master SVG via
  `scripts/gen-icons.mjs`; a proper `404.astro`. Added per-page meta descriptions to the
  section indexes that lacked them. Build 264 pages green.

## Phase 19 — Performance ✅
- **Lazy-load Fuse.js**: dynamic `import("fuse.js")` on first search open. Every page's
  initial JS dropped from ~29 KB to **~2.4 KB** (Fuse is now a 26.7 KB on-demand chunk).
- CodeMirror (≈636 KB) was already lazy/code-split; viz chunks already per-pattern.
- Reserved viz-mount height while empty → problem-page **CLS 0.133 → 0.004**.
- Lighthouse (desktop) after: home/problem/guide/playground/cheatsheet **100/100/100/100**.
  Before: home 100/95/100/100, problem 95/96/100/100, playground 100/96/100/100.

## Phase 20 — Accessibility ✅
- Added `--accent-solid` (#4f46e5) for white-on-accent fills (CTA, logo, skip link, Run
  button) — AA in both themes (dark accent was 2.98:1 with white).
- Light-mode `--accent` → indigo-600 and darker difficulty-badge text → AA on white/tints.
- Lightened the github-dark Shiki **comment** token (#6A737D → #8B949E) — was 3.9:1.
- `aria-label` on the CodeMirror editable region (named ARIA textbox); neutralized the
  card hover-lift under `prefers-reduced-motion`; verified one `<h1>`/page, no skipped
  heading levels, and reduced-motion suppression of viz auto-play. Contrast ratios were
  computed by hand for **both** themes (Lighthouse only tests the default dark theme).

## Phase 21 — Self-review loop ✅
- Looped build → check → tests → link-check → Lighthouse (desktop **and** mobile) → fix.
- Mobile Lighthouse: home/problem/neetcode150/learning/dashboard all **100/100/100/100**,
  tap-targets pass.
- Final suite green: `astro check` 0 errors; viz 18/18; runner 10/10; driver OK; build
  **264 pages**; link-check **11,921 links / 0 broken**; **0** AI-draft markers in any
  rendered page. Verified sitemap/RSS/robots/OG (264 PNGs)/JSON-LD/favicons all generate.
- Existing features intact: search, filters, progress/dashboard, cram, visualizations,
  code runner, problem drivers, learning guides.

---

## SUMMARY — Discoverability + polish (Part D)

On `chore/seo-and-polish`, a technical-only pass (no new content/claims):
**SEO** (sitemap, RSS, robots, canonical, per-page meta, schema.org JSON-LD), **static
social cards** (per-page OG/Twitter PNGs, offline), **performance** (lazy Fuse −26.6 KB/page,
CLS 0.133→0.004), **accessibility** (AA contrast in both themes, named editor, reduced-motion),
and **polish** (404, full favicon/PWA set, clean mobile). Lighthouse desktop + mobile are
100/100/100/100 across page types. The four content folders and `main` are untouched.

### Merge (your move — `main` untouched)
```bash
git checkout main && git merge chore/seo-and-polish && git push origin main
```
The existing `deploy.yml` rebuilds + publishes to GitHub Pages. After deploy, submit
`https://alanhsiu.github.io/Leetcode/sitemap-index.xml` in Google Search Console (a
project-site `robots.txt` lives under `/Leetcode/` and isn't read from the domain root —
see `NEEDS_REVIEW.md` §G). Re-run `node scripts/gen-icons.mjs` only if the master icon
SVG changes.

---
---

# PART v2 — PrepKit interview-prep platform (branch `feature/v2-platform`)

Generalize the site from a LeetCode-focused notes site into **PrepKit**, a general
interview-prep platform. Build stays green; `main` untouched; commit per phase; CI hermetic.

## Phase 0 — Explore & plan ✅
- Re-read the whole repo + the four content folders. Wrote `PLAN.md` (the new
  section/content model, folder relocation, per-problem Standard+My layout, nav redesign,
  rebrand checklist). Baseline build verified green (264 pages).

## Phase 1 — Generalize into drop-in sections + relocate the four folders ✅
- **Relocated** (via `git mv`, history preserved): `NeetCode 150/` + `Misc/` → `coding/`;
  `Interview Cheat Sheet/` + `CommonUsage/` → `reference/`. Updated `content.ts` globs +
  the driver-test corpus path.
- Replaced the learning-only collection with **one generalized `notes` Content-Layer
  collection** (`content/<section>/[<group>/]<note>.md`) powering **System Design,
  Behavioral, and Learning** from a single drop-in structure. Because Astro's glob loader
  collapses `index` ids, notes are classified from the whole entry set (`src/lib/notes.ts`).
- `src/data/sections.ts` (section + group registry) replaced `tracks.ts`; generic routes
  `/[section]` + `/[section]/[...slug]` replaced the learning-specific pages (existing
  `/learning/...` URLs preserved). Updated home, cram, dashboard, search-index, and seo.
- Seeded **original** System Design + Behavioral starter notes. Added
  `remark-base-links.mjs` so notes use root-absolute internal links safely.
- Green: 270 pages, 12140 links / 0 broken; check 0 errors; viz/runner/driver pass.

## Phase 2 — Standard Solution + My Solution on every problem ✅
- Each problem page now has two clearly-separated parts: **(a) Standard Solution** (original
  summary + approach + canonical C++ + complexity) and **(b) My Solution** (my own file,
  where I have one). The "▶ Run it" playground runs the shown solution.
- `Problem` split into `standard` + `mySolution` with a primary `code`/complexity for shared
  surfaces (cram, search, driver) — those keep working unchanged.
- **AI-authored Standard Solutions for all 188 problems:** 152 authored + adversarially
  verified by a background multi-agent workflow (305 agents), then **syntax-checked offline
  with `clang++ -fsyntax-only` (all 152 compile)**; the other 36 reuse the existing
  `AI_SOLUTIONS`. Stored in `src/data/standard/s1..s4.ts` (assembled by
  `scripts/build-standards.mjs`; per-problem JSON intermediates are gitignored). Provenance
  in `NEEDS_REVIEW.md` §H.

## Phase 3 — Responsive nav + generalized hero ✅
- Replaced the overflowing flat nav with **grouped, accessible dropdowns** (Coding,
  Reference) + direct links for the notes sections (from the registry, so new sections
  appear automatically); Dashboard moved to the right cluster. Dropdowns open on hover,
  keyboard focus-within, and click/touch (Escape + outside-click close, `aria-expanded`
  synced). Desktop nav at `lg+`; hamburger accordion below — **no horizontal overflow** at
  360 / 768 / 1280 / 1920 (the long links live in absolutely-positioned menus, so they can't
  widen the bar).
- Broadened the home hero from DSA-only to the full platform; Coding keeps its own intro.

## Phase 4 — Rebrand to PrepKit + base `/prepkit` ✅
- `astro.config` base `/Leetcode` → `/prepkit` (site unchanged); package name → `prepkit`.
- `SITE_NAME` → **PrepKit**; broadened description; title template, header logo, footer,
  manifest, robots sitemap host, RSS title all rebranded. OG cards, sitemap, RSS, canonical,
  and manifest icons regenerate under the new base; all internal links route through
  `href()`/`BASE_URL`.

## Phase 5 — CI/CD & docs ✅
- CI was already hermetic and free of stale path/brand refs — no changes needed beyond docs.
- Rewrote `README.md` (sections, the drop-in note structure, per-problem Standard+My,
  relocated folders, updated architecture/routes, `/prepkit` base). `PLAN.md`, this log, and
  `NEEDS_REVIEW.md` (§H/§I) updated. Ran the full self-review loop (below).

---

## SUMMARY — PrepKit v2 platform

PrepKit is now a general interview-prep platform on `feature/v2-platform`:

- **Sections.** Top-level **Coding** (specialized: problems, NeetCode 150, patterns, viz,
  playground, cram, dashboard), **System Design**, **Behavioral**, **Learning**, and
  **Reference**. System Design / Behavioral / Learning share **one drop-in markdown "notes"
  structure** — drop a file to add a page, drop a folder to add a section/group, zero wiring.
- **The four original folders** were relocated with `git mv` (history preserved) into
  `coding/` and `reference/`; every original note is reachable.
- **Every problem** shows a **Standard Solution** (canonical, AI-authored, clang-syntax-checked)
  and **My Solution** (my own file, where present); the in-browser runner still works.
- **Responsive grouped nav** (no overflow at any width) and a **platform-wide home hero**.
- **Rebranded to PrepKit** with `base: '/prepkit'` everywhere (OG/sitemap/RSS/manifest/icons).
- Hermetic CI unchanged and green.

### What to check first
1. A problem page — `/problems/1-two-sum` (Standard Solution **and** My Solution + viz +
   "▶ Run it") and an AI-only one like `/problems/56-merge-intervals` (Standard only).
2. The new sections — `/system-design`, `/behavioral` (drop-in notes), and `/learning`
   (unchanged track URLs preserved).
3. The **nav** at 360 / 768 / 1280 / 1920 — grouped dropdowns, nothing overflows.
4. `NEEDS_REVIEW.md` §H/§I — the 188 AI Standard Solutions + the seed notes to verify.
5. Search (`/`), `/cram`, and `/dashboard` — all now span problems **and** notes.

### Preview locally
```bash
npm install
npm run dev        # http://localhost:4321/prepkit/
# or the production build + full checks:
npm run build && npm run preview
npm run check && npm run viz-test && npm run runner-test && npm run driver-test
npm run build && npm run linkcheck
```
Note: the code runner calls the public Wandbox sandbox from your browser at runtime; the
build, tests, and CI never call it.

### Go live (your move — `main` untouched)
```bash
git checkout main && git merge feature/v2-platform && git push origin main
```
The existing `deploy.yml` then builds + publishes to GitHub Pages. The site is served under
`/prepkit/`, so ensure the repo is named **prepkit** (the brief notes it was already
renamed). One-time, if not already set: repo **Settings → Pages → Source = "GitHub Actions"**.
