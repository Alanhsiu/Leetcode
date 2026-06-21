# DSA Interview Notes + Learning Platform

A fast, visual, searchable site built from my personal LeetCode / interview-prep
notes — plus a multi-track **learning platform** and an **in-page code runner**.
C++ solutions, NeetCode 150 coverage, C++ STL reference, topic cheat sheets, a
library of interactive algorithm **visualizations**, and concept guides for
Temporal / Mender / GCP — with full-text search, pattern/difficulty filters, a
cram mode, per-item progress tracking, and a runnable playground on every problem.

- **Live:** https://alanhsiu.github.io/Leetcode/
- **Stack:** [Astro](https://astro.build) 5 + TypeScript (static output), Tailwind CSS v4,
  Shiki, Fuse.js, [CodeMirror 6](https://codemirror.net) (editor), MDX (guides),
  `@astrojs/sitemap` + `@astrojs/rss`, and `astro-og-canvas` for build-time social cards.
- **Two top-level sections:** **Coding Interview** (problems, patterns, viz, cram, …)
  and **Learning** (Temporal, Mender, GCP tracks).

## Two things to know first

- **In-page code runner.** Problem pages and the [`/playground`](#in-page-code-runner)
  let you edit and run C++/Python/JS and see stdout/stderr/exit code in the browser.
  Execution goes through one swappable client (`src/lib/runner.ts`); the default
  backend is the public **Wandbox** sandbox (the public Piston endpoint became
  whitelist-only in Feb 2026 — see [Code runner](#in-page-code-runner)).
- **Content provenance.** Some NeetCode coverage and the learning guides were
  originally AI-drafted; these were reviewed and the on-site "AI" markers removed.
  `NEEDS_REVIEW.md` (§A, §F, §G) keeps the record of what was AI-authored. The
  in-browser problem "drivers" are still synthesized heuristically and labelled
  **unverified** in the "Run it" panel (see [auto-drivers](#problem-playgrounds-auto-drivers)).

## Content sources

The coding-interview material is **driven by four read-only folders** — the build
reads them; nothing writes to them:

| Folder | What it holds | Becomes |
| --- | --- | --- |
| `NeetCode 150/` | C++ solutions `<num>. <Title>.cpp` | problem pages |
| `Misc/` | more C++ solutions (same format) | problem pages |
| `Interview Cheat Sheet/` | `.md` (CS / EDA / GPU / HW) + one `.cpp` | cheat sheets |
| `CommonUsage/` | C++ STL `.md` references | reference pages |

The **learning platform** is driven by a separate, writable folder:

| Folder | What it holds | Becomes |
| --- | --- | --- |
| `content/learning/<track>/` | `.md` / `.mdx` guides (+ `index.md` landing) | learning track + guides |

**Adding a note is zero-config:** drop a new `<number>. <Title>.cpp` into
`NeetCode 150/` or `Misc/` (or a `.md` into the other two folders) and push — the
build discovers it via a glob, parses the title/number/complexity, looks up its
difficulty & pattern, renders a syntax-highlighted page, indexes it for search,
slots it into the relevant pattern + NeetCode 150 grid, **and adds a runnable
playground**. [Adding a guide/track](#adding-a-learning-track-or-guide) is just as easy.

## Architecture

```
astro.config.mjs        site + base (/Leetcode), Tailwind, MDX, dual-theme Shiki
content/learning/        learning tracks (writable): <track>/index.md + guides (.md/.mdx)
src/
  content.config.ts     Content Layer: the "learning" collection (glob + zod schema)
  lib/content.ts        the pipeline: import.meta.glob(?raw) over the 4 read-only folders
  lib/learning.ts       groups guide files into tracks (derives track from folder)
  lib/runner.ts         ⭐ ONE runCode() client; swappable backend (Wandbox default)
  lib/driver.ts         auto-generates a main() + sample input for a class Solution
  lib/seo.ts            ⭐ SEO single-source: page list, OG route key, canonical URLs, JSON-LD
  lib/highlight.ts      Shiki dual-theme C++ highlighting (marked pipeline)
  lib/markdown.ts       marked + Shiki for cheat sheets / reference
  lib/patterns.ts       18 patterns ↔ which visualization each embeds
  data/neetcode150.ts   factual NeetCode 150 list (number/title/difficulty/slug/category)
  data/extraProblems.ts factual metadata for non-NC150 problems
  data/aiSolutions*.ts   AI-authored coverage for NC150 problems I haven't noted (flagged)
  data/tracks.ts        learning-track registry (title/blurb/icon/order)
  scripts/viz/          the visualization engine (base.ts) + 18 animations
  scripts/code-editor.ts  CodeMirror 6 factory (lazy-loaded by <CodeRunner>)
  scripts/progress.ts   localStorage progress (solved / review / confident)
  components/           Header, SearchOverlay, CodeRunner, CodeBlock, LevelBadge, Viz, …
  pages/                routes (see below) + open-graph/[...route].ts (OG images),
                        rss.xml.ts, search-index.json.ts, 404.astro
  assets/og/            bundled Inter fonts for OG cards · assets/icon-master.svg
public/                 robots.txt, site.webmanifest, favicon set (generated)
scripts/gen-icons.mjs   regenerate the favicon/app-icon set from icon-master.svg
scripts/linkcheck.mjs   internal broken-link checker (used in CI)
scripts/viz-smoke.mjs   fake-DOM test that steps every frame of every viz
scripts/runner-test.mjs hermetic runner test (mocked fetch — no network)
scripts/driver-test.mjs hermetic driver-generator test over the C++ corpus
```

**Routes:** `/` · `/problems` (filterable) · `/problems/<n>-<slug>` (+ playground) ·
`/patterns` + `/patterns/<slug>` · `/neetcode150` · `/visualizations` · `/playground` ·
`/cheatsheets` (+ pages) · `/reference` (+ pages) · `/cram` · `/dashboard` ·
`/learning` · `/learning/<track>` · `/learning/<track>/<guide>`.

### Notable bits
- **Search**: a build-time `/search-index.json` + a Fuse.js overlay (press `/`).
- **Progress**: stored in `localStorage`; surfaced as status dots everywhere and a `/dashboard`.
- **Visualizations**: framework-free SVG, code-split, with play/pause/step/speed,
  keyboard control, and `prefers-reduced-motion` support. Auto-embedded per pattern.
- **Dark mode** is the default; a no-flash inline script restores the saved theme.

## SEO, social & discoverability

All build-time and static — nothing runs at request time:

- **Sitemap** via `@astrojs/sitemap` (`/sitemap-index.xml`; the OG images are excluded),
  linked from every page and referenced in `robots.txt`.
- **RSS** (`@astrojs/rss`) at `/rss.xml` — the article-like content (learning guides +
  cheat sheets + C++ reference), linked via `<link rel="alternate">`.
- **Per-page meta**: canonical URL, description, `og:*`/`twitter:*` (incl. `og:image`),
  `og:site_name`/`og:locale`, and a `noindex` for the dashboard/404.
- **Structured data** (JSON-LD): `WebSite` on the home page; `TechArticle` +
  `BreadcrumbList` on problems, guides, cheat sheets and reference; `BreadcrumbList`
  on pattern pages.
- **Social cards**: one 1200×630 PNG per page, generated at build time by
  `astro-og-canvas` (canvaskit-wasm) from `src/lib/seo.ts`'s page list, using bundled
  Inter fonts (`src/assets/og/`) so the build is **offline/hermetic**. Served at
  `/open-graph/<route>.png`; `BaseLayout` derives the same route key per page.
- **Favicons / PWA**: a full icon set (`favicon.svg` + `.ico` + 16/32/180/192/512 PNGs +
  maskable) and `site.webmanifest`, all generated from one master SVG by
  `node scripts/gen-icons.mjs`.
- **404**: a static `src/pages/404.astro` with section links (GitHub Pages serves it
  for unknown paths).

> `src/lib/seo.ts` is the single source of truth for the site identity, the OG route
> key, canonical/absolute URLs, the full page list, and the JSON-LD builders — the
> sitemap filter, RSS feed, OG route, and per-page structured data all read from it.

## In-page code runner

Edit and run C++/Python/JS in the browser, with stdout/stderr/exit code/elapsed time
shown inline. It's used on `/playground`, on every problem page (collapsible **"▶ Run
it"**), and inside guides via `<CodeRunner>`.

**The whole execution backend lives behind one function**, so it's swappable in one place:

```ts
// src/lib/runner.ts
runCode({ language, version?, files, stdin? }) → Promise<RunResult>
```

- **Editor:** `<CodeRunner>` renders a `<textarea>` (no-JS fallback) and progressively
  enhances it to **CodeMirror 6**, which is `import()`-ed lazily (a ~600 KB chunk that
  loads only when an editor first scrolls into view — collapsed playgrounds stay free).
- **Backend:** chosen by the `RUNNER` map in `runner.ts`. The default is **Wandbox**
  (free, public, CORS-enabled, runs C++/Python/JS). The public **Piston** endpoint
  (`emkc.org`) became **whitelist-only on 2026-02-15**, so it can't be the default — but
  a `piston` adapter remains with a configurable base URL.
- **Safety/limits:** code runs in a public sandbox (the UI says so — don't paste
  secrets). Runs are debounced, Run is disabled in-flight, and network/rate-limit/timeout
  errors show a friendly message. **The API is only ever called from the browser** — the
  build, tests, and CI never touch it.

### Swapping the execution backend

Edit one object. To point at a **self-hosted Piston** (recommended for production):

```ts
// src/lib/runner.ts
export const PISTON_BASE = "https://piston.your-domain.com/api/v2/piston";
export const RUNNER = {
  cpp:        { provider: "piston", id: "*" },
  python:     { provider: "piston", id: "*" },
  javascript: { provider: "piston", id: "*" },
};
```

To add a brand-new backend (e.g. Judge0), implement the small `Provider` interface in
`runner.ts`, register it in `PROVIDERS`, and point `RUNNER` at it. Nothing else changes.

### Problem playgrounds (auto-drivers)

LeetCode solutions have no `main()`, so `src/lib/driver.ts` parses the first method of
`class Solution` and synthesizes a self-contained program: a headers + `TreeNode`/
`ListNode` harness, plus a `main()` that builds **sample** inputs and prints the result.
These drivers and inputs are **heuristic and unverified** (see `NEEDS_REVIEW.md`); the
editor is fully editable and **Reset** restores the generated starting point.

## Adding a learning track or guide

The learning platform is zero-wiring, like the problem notes:

- **Add a guide:** drop a `.md` or `.mdx` file into `content/learning/<track>/`. Frontmatter:
  ```yaml
  ---
  title: Workers & Task Queues
  description: One-line summary (shown in outlines + search).
  level: Intermediate        # Beginner | Intermediate | Advanced (optional)
  order: 3                    # position in the track outline
  tags: [concepts, scaling]
  aiGenerated: true           # set true for anything an AI drafted (badges + flags it)
  ---
  ```
  Use `.mdx` to embed components — `import CodeRunner from "@/components/CodeRunner.astro"`
  for a runnable snippet, or `import Viz from "@/components/Viz.astro"` then `<Viz id="dijkstra" />`.
- **Add a track:** create a new folder under `content/learning/`, add an `index.md`
  (its landing intro) and some guides. Optionally add an entry to `src/data/tracks.ts`
  for a nicer title/blurb/icon/order (otherwise the folder name is humanized). It appears
  in the nav, the `/learning` hub, search, cram, and the dashboard automatically.

> Infra commands (e.g. GCP `gcloud`) should stay **read-only** fenced code blocks (with a
> copy button) — don't wrap them in `<CodeRunner>`; the sandbox can't run them, and faking
> it would mislead.

## Run locally

```bash
npm install      # if npm prompts about install scripts, approve esbuild + sharp
                 #   (already recorded under "allowScripts" in package.json)
npm run dev      # dev server at http://localhost:4321/Leetcode/
```

Other scripts:

```bash
npm run build        # static build into dist/
npm run preview      # serve the built site
npm run check        # astro type-check (0 errors required)
npm run linkcheck    # fail on any broken internal link (run after build)
npm run viz-test     # mount every visualization and step every frame
npm run runner-test  # hermetic code-runner test (fetch mocked — no network)
npm run driver-test  # hermetic driver-generator test over the C++ corpus
```

## CI / CD

Two GitHub Actions workflows (`.github/workflows/`):

- **`ci.yml`** — on pull requests (and non-main pushes): `npm ci` → `astro check`
  → visualization smoke test → **code-runner test** → **driver-generator test** →
  `build` → internal-link check. The PR fails on a broken link or a type/build/test
  error. **CI is hermetic** — the runner/driver tests mock the network and the
  execution API is never called during the build or in CI.
- **`deploy.yml`** — on push to `main` (or manual dispatch): builds with the
  official `withastro/action` and deploys to GitHub Pages
  (`contents: read`, `pages: write`, `id-token: write`).

**One-time setup:** in the repo, **Settings → Pages → Build and deployment →
Source = "GitHub Actions"** (this replaces the previous `gh-pages`-branch deploy).
After that, every push to `main` — including just adding a note file — rebuilds
and redeploys the site automatically.

## Copyright

LeetCode problem **statements** are copyrighted and are **not** reproduced. Pages
show only facts (number, title, difficulty, pattern), a link to the official
problem, my own notes/solutions, and — for problems I haven't written up — short
**original** summaries plus a solution. The provenance of any originally
AI-authored coverage is recorded in `NEEDS_REVIEW.md`.

## See also

- `PLAN.md` — design decisions and site map.
- `PROGRESS.md` — build log + how to preview and merge.
- `NEEDS_REVIEW.md` — everything AI-authored/unverified and decisions to check.
