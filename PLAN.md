# PLAN — Online IDE + Multi-Track Learning Platform

Branch: `feature/online-ide-and-learning`. Builds on the existing Astro 5 + TS static
site (GitHub Pages, base `/Leetcode/`). Two goals: **(A)** an in-page code runner so
visitors can run code and see output without leaving the site, and **(B)** generalize
the content model into a multi-track learning platform (new tracks: Temporal, Mender,
GCP). Optimize for clean, reusable architecture and quality. The original site-rebuild
plan (Phases 0–7) is preserved in **Appendix A** below.

## Absolute rules (carried from the brief)
1. The four content folders — `NeetCode 150/`, `Misc/`, `Interview Cheat Sheet/`,
   `CommonUsage/` — are **READ-ONLY**. Read only; never write. New content goes in new
   folders (`content/learning/...`).
2. Work only on `feature/online-ide-and-learning`. Never push/merge `main`.
3. Build stays green; commit per phase; never commit a broken build.
4. No backend, no server, no paid services. Stays a static GitHub Pages site.
5. Any learning content the agent authors is frontmatter-tagged `aiGenerated: true` and
   listed in `NEEDS_REVIEW.md`. Auto-generated problem drivers are likewise unverified.

---

## Provider decision (Part A) — confirmed against live docs/endpoints, 2026-06-20

The brief defaulted to the public **Piston** API and said to *confirm the endpoint
first*. I did:

- **Piston (emkc.org)** `GET /runtimes` → 200, but `POST /execute` → **HTTP 401:
  "Public Piston API is now whitelist only as of 2/15/2026."** Unusable without a
  whitelist, and we can't self-host (no backend allowed).
- **Wandbox** (`wandbox.org/api/compile.json`) → `Access-Control-Allow-Origin: *`;
  uniformly executes **C++ (gcc-13.2.0), Python (cpython-3.13.8), JS (nodejs-20.17.0)**
  with one request/response shape. Verified live (hello-world per language, stdin
  honored). Browser calls use `Content-Type: text/plain` to stay a CORS *simple
  request* (no preflight) — Wandbox parses the JSON body regardless; verified.
- **Godbolt** (`godbolt.org/api`) → CORS `*` and allows `Content-Type`; executes C++
  well but **cannot execute JavaScript** (0 executors) and only offers MicroPython.
  Kept as a C++-only alternative adapter.

**Decision:** default provider = **Wandbox**, behind a swappable abstraction. Adapters
shipped: `wandbox` (default), `godbolt` (C++ alt), `piston` (configurable base URL — the
brief's named swap target for a self-hosted/whitelisted instance). Swapping the backend
= editing one config object in `src/lib/runner.ts`. Logged in `NEEDS_REVIEW.md`.

Runtime is the **only** time the API is called — from the visitor's browser. The build,
tests, and CI never call it (hermetic).

---

## Part A — In-page code runner

**A.1 Abstraction — `src/lib/runner.ts`.** One public function
`runCode({ language, version?, files, stdin? }) → Promise<RunResult>` where
`RunResult = { stdout, stderr, exitCode, signal?, compileMessage?, timeMs, ok, provider }`.
Internals: a `Provider` interface + `wandbox`/`godbolt`/`piston` adapters and a single
`RUNNER` config mapping each language → `{ provider, id }`. Languages normalized to
`cpp | python | javascript`. Typed errors (network / rate-limit / non-200 / timeout);
`timeMs` is client-measured elapsed (round-trip incl. network — labeled honestly, since
no free provider returns CPU time).

**A.2 `<CodeRunner>` — `src/components/CodeRunner.astro`.** Reusable island:
CodeMirror 6 editor + optional stdin box + Run + Reset + output pane
(stdout / stderr / exit code / elapsed) + language label + a "runs in a public sandbox
(Wandbox)" note. **CodeMirror 6** over Monaco: far smaller, tree-shakeable, no web-worker
/CDN requirement — right for a static SSG island. Loaded via dynamic `import()` so it is
code-split and only fetched when a runner is actually used; a plain `<textarea>` is the
no-JS / pre-hydration fallback. Theme-aware (dark/light), debounced, Run disabled while a
job is in flight, friendly error messages, `aria-live` output, keyboard-operable.

**A.3 LeetCode playground — `src/lib/driver.ts`.** Parse the first public method of
`class Solution` (return type, name, params). Generate a `main()` that builds a sample
input for supported types (`int/long/double/bool/char/string`, `vector<…>` 1-D/2-D of
those) and prints the result; unsupported signatures (`TreeNode*`, `ListNode*`, custom
structs) get a *compiling* stub `main()` that prints guidance instead of a broken build.
Returns `{ runnable, fullCode, stdin, generated, note }`. Each problem page gains a
collapsible **"Run it"** playground (CodeRunner preloaded with solution + driver + one
sample input), lazy-mounted on open; the canonical Shiki "My solution" view stays primary.
Drivers + sample inputs are **unverified** → tagged and described in `NEEDS_REVIEW.md`.
Infra/CLI snippets (GCP `gcloud`, etc.) are **never** fake-executed — read-only code block
+ copy (existing `CodeBlock`).

## Part B — Multi-track learning platform

**B.1 Content model.** New content type **guide** via Astro 5's **Content Layer**
(`glob` loader over `content/learning/**/*.md`, zod-validated frontmatter:
`title, description, track, level, tags, order, aiGenerated`). **Tracks** = subfolders of
`content/learning/`; an optional `index.md` provides the landing intro; `src/data/tracks.ts`
holds order/icon/blurb with a humanized-folder fallback. Zero-wiring: drop a `.md` in a
track folder → it appears (TOC, search, nav). New track = new folder (+ optional registry
entry). The four protected folders are untouched.

**B.2 Routes & nav.** `/learning` (hub: track cards), `/learning/<track>` (landing +
outline/TOC + level badges), `/learning/<track>/<guide>` (rendered guide, reusing the
problem-page reading experience). Top-level nav gains **Learning** alongside the existing
"Coding Interview" items; homepage gains a Learning section.

**B.3 Reuse across both content types.** Search (`guide` docs added to
`/search-index.json`), tags + a `LevelBadge` reusing the badge CSS, progress tracking
(`progress.ts` is slug-keyed — works for guides as-is) + dashboard, cram/quick-review
(guides section), and visualizations embeddable in guide markdown via a ` ```viz ` fenced
block → `data-viz-mount` (same loader).

**B.4 Three tracks (aiGenerated starter content).**
- **Temporal** — durable execution: what/why, Workflows & Activities, Workers & Task
  Queues, Retries/Timeouts, Signals & Queries. SDK code = read-only (needs a server);
  CodeRunner only for self-contained illustrations.
- **Mender** — embedded OTA: concepts, Artifacts, Deployments, state scripts, delta.
  Mostly conceptual + CLI/yaml (read-only).
- **GCP** — Cloud Run, GKE, Pub/Sub, Cloud Storage, IAM, BigQuery. `gcloud`/`bq` are
  read-only code blocks + copy (never fake-run).

## Part C — CI/CD & docs

Extend CI: add hermetic Node tests for the runner (request shaping + result
normalization with a mocked `fetch`) and the driver generator (no network); keep
type-check → tests → build → link-check; **CI never calls the execution API**. Deploy
flow unchanged. Update `README.md` (new architecture; how to add a track/guide; how the
runner works + how to swap the backend), `PROGRESS.md` (log + final summary + what to
check first / preview / merge), `NEEDS_REVIEW.md` (aiGenerated guides, auto drivers, the
provider change).

## Phases (commit per phase, build green each)
- **8** — Plan + provider spike (this doc).
- **9** — Runner core (`runner.ts` + adapters + hermetic test).
- **10** — `<CodeRunner>` + CodeMirror 6.
- **11** — Driver generator + problem-page playgrounds.
- **12** — Learning platform core (collections, routes, nav, reuse wiring).
- **13** — Temporal / Mender / GCP starter content.
- **14** — Reuse polish (cram, dashboard, homepage, search across both).
- **15** — CI/CD + docs.
- **16** — Self-review loop (incl. a few real in-browser runs) → push branch.

## Self-review & definition of done
Build green; existing LeetCode site fully intact; `<CodeRunner>` runs C++/Python/JS
in-page via the abstracted client; problems have an editable, resettable runnable
playground; three tracks scaffolded (nav + outlines + tagged starter content);
search/tags/cram/progress/viz work across both content types; CI hermetic + green; docs
updated; branch pushed; `main` untouched.

---
---

# Appendix A — Original site-rebuild plan (Phases 0–7)

Branch: `redesign`. Target deploy: GitHub Pages at `https://alanhsiu.github.io/Leetcode/`.

## A.1 Content sources (READ-ONLY)

Four folders are content sources and are never written to:

| Folder | Files | Shape |
| --- | --- | --- |
| `NeetCode 150/` | 114 × `.cpp` | `<num>. <Title>.cpp`, a C++ `Solution` class + inline comments + `// Time/Space Complexity` footer |
| `Misc/` | 38 × `.cpp` | Same shape; extra problems beyond NC150 |
| `Interview Cheat Sheet/` | 17 × `.md` (+1 `.cpp`) | Topic cheat sheets in `CS/`, `EDA/`, `GPU/`, `HW/` |
| `CommonUsage/` | 11 × `.md` | C++ STL quick-reference docs |

Total: **152 problem solutions** + 18 cheat sheets + 11 reference docs.

## A.2 Content model

At build time we **read** the four folders (never mutate them) and derive collections:

- **problem** — one per `.cpp` in `NeetCode 150/` + `Misc/`. Parsed: `number`, `title`,
  `source`, `code`, `language` `cpp`, time/space complexity (from the footer), plus
  curated `difficulty`/`patterns[]`/`leetcodeSlug` with algorithmic slug fallback.
- **cheatsheet** — one per `.md` under `Interview Cheat Sheet/`, grouped by top folder.
- **reference** — one per `.md` in `CommonUsage/`.

Loaders use Vite `import.meta.glob(?raw, eager)` over the repo-root folders, so adding a
new file later auto-appears with zero wiring.

Copyright: render only the user's own notes/code + facts (number, title, difficulty,
pattern, official URL) + original short summaries. No LeetCode statements reproduced;
AI-authored summaries/solutions tagged `aiGenerated: true` and logged in `NEEDS_REVIEW.md`.

## A.3 SSG choice — Astro + TypeScript (static)

Zero-JS-by-default static HTML, island hydration for interactive viz/search, first-class
TS, Shiki highlighting, trivial `site`/`base` for project Pages, Vite globs to ingest
external files untouched. `site: 'https://alanhsiu.github.io'`, `base: '/Leetcode'`; all
internal links via a `href()` helper. Tailwind v4; dark default + light toggle. Search =
build-time `/search-index.json` + Fuse.js island. Visualizations = framework-free
vanilla-TS custom elements with a shared base controller, reduced-motion aware.

## A.4 Site map (original)

`/` · `/problems` (+ `/problems/<n>-<slug>`) · `/patterns` (+ `/patterns/<slug>`) ·
`/neetcode150` · `/visualizations` · `/cheatsheets` (+ pages) · `/reference` (+ pages) ·
`/dashboard` · `/cram`.

## A.5–A.7

Visualization library (18 animations), CI/CD (PR check + Pages deploy), and
progress/review/docs as logged in `PROGRESS.md` Phases 3–7.
