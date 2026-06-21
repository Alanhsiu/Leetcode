# PrepKit

A fast, searchable **interview-prep platform** built as a static site. Coding problems
with a canonical **Standard Solution** and **My Solution** side by side (runnable in the
browser), interactive algorithm **visualizations**, **System Design** and **Behavioral**
notes, hands-on **Learning** tracks, and **Reference** cheat sheets / C++ STL notes — with
full-text search, pattern/difficulty filters, a cram mode, and per-item progress tracking.
Anyone can extend it by dropping a markdown file into a section folder.

- **Live:** https://alanhsiu.github.io/prepkit/
- **Stack:** [Astro](https://astro.build) 5 + TypeScript (static output), Tailwind CSS v4,
  Shiki, Fuse.js, [CodeMirror 6](https://codemirror.net) (editor), MDX (notes),
  `@astrojs/sitemap` + `@astrojs/rss`, and `astro-og-canvas` for build-time social cards.

## Sections

PrepKit is organized into top-level **sections**, two kinds:

| Section | Kind | Source | What it is |
| --- | --- | --- | --- |
| **Coding** | specialized | `coding/**/*.cpp` + curated metadata | Problems, NeetCode 150, Patterns, Visualizations, Playground, Cram, Dashboard. |
| **System Design** | notes | `content/system-design/**` | Drop-in markdown notes. |
| **Behavioral** | notes | `content/behavioral/**` | Drop-in markdown notes. |
| **Learning** | notes | `content/learning/<track>/**` | Multi-track guides (Temporal / Mender / GCP). |
| **Reference** | reference | `reference/**` | Cheat sheets (CS/EDA/GPU/HW) + C++ STL reference. |

The **System Design / Behavioral / Learning** sections all share **one drop-in "notes"
structure** (below). **Coding** and **Reference** are specialized (their own routes + a raw
`.cpp`/`.md` glob pipeline).

## Two things to know first

- **Per-problem Standard + My Solution.** Every coding problem page shows a **Standard
  Solution** (a clean canonical reference: original summary, approach, C++, complexity) and
  — where I have one — **My Solution** (my own file, unchanged). The "▶ Run it" playground
  runs the shown solution in the browser.
- **Provenance.** The Standard Solutions are **AI-authored and unverified** (not run against
  the judge); the System Design / Behavioral / Learning starter notes were AI-drafted. All
  of this is recorded in `NEEDS_REVIEW.md` for batch verification. No LeetCode problem text
  is reproduced — only facts + a link + original summaries.

## Adding content (drop-in, zero wiring)

**Add a coding problem:** drop a `<number>. <Title>.cpp` into `coding/neetcode-150/` or
`coding/misc/`. The build discovers it via a glob, parses title/number/complexity, looks up
difficulty + pattern, renders the page (My Solution), indexes it for search, and slots it
into the pattern + NeetCode 150 grids. (Authoring its Standard Solution is a separate data
step — see `src/data/standard/`.)

**Add a note** (System Design, Behavioral, Learning, or any new section): drop a `.md`/`.mdx`
file under `content/<section>/`. The folder layout *is* the structure:

```
content/<section>/<note>.md            → /<section>/<note>           (a note in a flat section)
content/<section>/<group>/<note>.md     → /<section>/<group>/<note>   (a note inside a group)
content/<section>/index.md              → /<section>                 (section landing intro)
content/<section>/<group>/index.md      → /<section>/<group>         (group landing intro)
```

- The **section** is the top-level folder; an optional **group** is the second-level folder
  (Learning "tracks" are just groups). A page appears with no code changes.
- **Add a new section:** make a new folder under `content/` — it shows up in the nav and on
  the home page automatically (humanized name fallback). Add an entry to
  `src/data/sections.ts` for a nicer title/blurb/icon/order.
- **Frontmatter:**
  ```yaml
  ---
  title: The STAR method          # required
  description: One-line summary (shown in outlines + search).
  level: Beginner                 # Beginner | Intermediate | Advanced (optional)
  order: 1                         # position in the section/group outline
  tags: [star, storytelling]
  aiGenerated: true                # set true for anything an AI drafted (provenance)
  ---
  ```
- **Internal links** between notes: use a root-absolute path, e.g.
  `[STAR method](/behavioral/star-method)`. A remark plugin (`src/lib/remark-base-links.mjs`)
  prefixes the site base automatically, so links work under `/prepkit/` and are
  trailing-slash safe.
- Use `.mdx` to embed components: `import CodeRunner from "@/components/CodeRunner.astro"`
  for a runnable snippet, or `import Viz from "@/components/Viz.astro"` then
  `<Viz id="dijkstra" />`. The note is automatically added to search, cram, and the dashboard.

## How I capture a note

The everyday flow is **two commands**:

```bash
npm run note -- "What is a service mesh"   # 1. scaffold + open in $EDITOR
# ...write the note, save, close the editor...
npm run publish                            # 2. commit + push
```

- `npm run note` is the only thing you have to think about. Give it a **title** (as the
  argument above, or it'll prompt). It then asks **type** (`concept` | `leetcode` | `other`,
  default `concept`) and **optional tags** — press Enter to accept the defaults. It writes a
  timestamped markdown file to `content/notes/<slug>.md` (auto `createdAt`/`updatedAt`,
  `slug` from the title) from a template and opens it in `$EDITOR`.
  - **`leetcode`** notes get extra prompts (problem number, difficulty, official URL) and a
    template with **Problem / Approach / My solution** (a `cpp` code block) / **Complexity**.
- `npm run publish` stages everything, commits with an auto message
  `note: <title> (<YYYY-MM-DD>)`, and pushes the **current branch**. On `main` that triggers
  the Pages deploy; on a feature branch it just pushes for review.

Captured notes appear under **`/notes`** (newest first, with a Newest/Oldest toggle) and on
the **[`/timeline`](/timeline)** page (all notes, grouped by day, with type/tag filters and
stats).

### From a phone / no CLI (GitHub web editor)

No terminal? Add a note straight from the GitHub web editor — it works on mobile:

1. In the repo, go to **`content/notes/`** → **Add file → Create new file**.
2. Name it `something-descriptive.md` and paste this template:
   ```markdown
   ---
   title: Your note title
   type: concept        # concept | leetcode | other
   tags: [tag1, tag2]
   ---

   ## Summary

   ...
   ```
3. Commit. **You don't need a `createdAt`** — the build derives it from the file's first
   git commit date (`src/lib/dates.ts`), so the note is timestamped and sorts correctly on
   `/notes` and `/timeline` automatically. Committing to `main` deploys it.

## Architecture

```
astro.config.mjs        site + base (/prepkit), Tailwind, MDX, dual-theme Shiki,
                         remark-base-links (base-prefix root-absolute note links)
coding/                  problem store (read by glob): neetcode-150/*.cpp, misc/*.cpp
reference/               cheat sheets (cheatsheets/<group>/*) + C++ reference (cpp/*.md)
content/<section>/        notes collection: system-design/, behavioral/, learning/<track>/
src/
  content.config.ts     Content Layer: the generalized "notes" collection (glob + zod)
  lib/content.ts        pipeline: import.meta.glob(?raw) over coding/ + reference/
  lib/notes.ts          classifies notes into section/group/landing; builds section views;
                         resolves createdAt/updatedAt + powers the /timeline list
  lib/dates.ts          git-derived createdAt/updatedAt (first/last commit) with fallbacks
  lib/format.ts         small client-safe date helpers (day/week keys, headings)
  lib/runner.ts         ⭐ ONE runCode() client; swappable backend (Wandbox default)
  lib/driver.ts         auto-generates a main() + sample input for a class Solution
  lib/seo.ts            ⭐ SEO single-source: page list, OG route key, canonical, JSON-LD
  lib/markdown.ts       marked + Shiki for cheat sheets / reference
  lib/patterns.ts       18 patterns ↔ which visualization each embeds
  data/sections.ts      section + group registry (title/blurb/icon/order/kind)
  data/neetcode150.ts   factual NeetCode 150 list (number/title/difficulty/slug/category)
  data/extraProblems.ts factual metadata for non-NC150 problems
  data/aiSolutions*.ts   AI Standard Solutions for the 36 NC150 problems with no note of mine
  data/standard/s1..s4.ts  AI Standard Solutions for the 152 problems I have noted (by routeSlug)
  scripts/viz/          the visualization engine (base.ts) + 18 animations
  scripts/progress.ts   localStorage progress (solved / review / confident)
  components/           Header (grouped responsive nav), SearchOverlay, CodeRunner, …
  pages/                routes (below) + open-graph/[...route].ts, rss.xml.ts,
                        search-index.json.ts, 404.astro
public/                 robots.txt, site.webmanifest, favicon set (generated)
scripts/new-note.mjs    `npm run note` — scaffold a timestamped note + open $EDITOR
scripts/publish.mjs     `npm run publish` — commit "note: <title> (<date>)" + push
scripts/build-standards.mjs  assemble per-problem JSON → src/data/standard/*.ts shards
scripts/gen-icons.mjs   regenerate the favicon/app-icon set from icon-master.svg
scripts/linkcheck.mjs   internal broken-link checker (used in CI)
scripts/{viz-smoke,runner-test,driver-test}.mjs  hermetic tests (used in CI)
```

**Routes:** `/` · `/problems` (filterable) · `/problems/<n>-<slug>` (Standard + My + playground)
· `/patterns` + `/patterns/<slug>` · `/neetcode150` · `/visualizations` · `/playground` ·
`/cheatsheets` (+ pages) · `/reference` (+ pages) · `/cram` · `/dashboard` · `/timeline` ·
`/<section>` · `/<section>/<group>` · `/<section>/[...note]` (System Design, Behavioral,
Learning, Notes — generic).

### Notable bits
- **Search**: a build-time `/search-index.json` + a Fuse.js overlay (press `/`), spanning
  problems, notes, cheat sheets, and reference.
- **Progress**: stored in `localStorage`; status dots everywhere + a `/dashboard` covering
  problems and notes.
- **Visualizations**: framework-free SVG, code-split, with play/pause/step/speed, keyboard
  control, and `prefers-reduced-motion` support. Auto-embedded per pattern.
- **Nav**: grouped, responsive (Coding/Reference dropdowns + section links); collapses to a
  hamburger accordion — no horizontal overflow at any width.
- **Dark mode** is the default; a no-flash inline script restores the saved theme.

## In-page code runner

Edit and run C++/Python/JS in the browser, with stdout/stderr/exit code/elapsed shown
inline. Used on `/playground`, on every problem page (collapsible **"▶ Run it"**), and in
notes via `<CodeRunner>`. The whole backend lives behind one function:

```ts
// src/lib/runner.ts
runCode({ language, version?, files, stdin? }) → Promise<RunResult>
```

- **Editor:** `<CodeRunner>` renders a `<textarea>` (no-JS fallback) and lazily enhances it
  to **CodeMirror 6** (a ~600 KB chunk loaded only when an editor scrolls into view).
- **Backend:** the `RUNNER` map in `runner.ts`. Default is **Wandbox** (free, public,
  CORS-enabled). The public **Piston** endpoint became whitelist-only on 2026-02-15, so a
  `piston` adapter remains with a configurable base URL.
- **The API is only ever called from the browser** — the build, tests, and CI never touch it.

### Swapping the execution backend

Point `RUNNER` at a self-hosted Piston (recommended for production):

```ts
// src/lib/runner.ts
export const PISTON_BASE = "https://piston.your-domain.com/api/v2/piston";
export const RUNNER = {
  cpp:        { provider: "piston", id: "*" },
  python:     { provider: "piston", id: "*" },
  javascript: { provider: "piston", id: "*" },
};
```

To add another backend (e.g. Judge0), implement the small `Provider` interface, register it
in `PROVIDERS`, and point `RUNNER` at it.

### Problem playgrounds (auto-drivers)

LeetCode solutions have no `main()`, so `src/lib/driver.ts` parses the first method of
`class Solution` and synthesizes a self-contained program (headers + `TreeNode`/`ListNode`
harness + a `main()` that builds **sample** inputs and prints the result). These drivers and
inputs are **heuristic and unverified**; the editor is fully editable and **Reset** restores
the generated starting point.

## SEO, social & discoverability

All build-time and static — nothing runs at request time: a sitemap (`/sitemap-index.xml`),
RSS (`/rss.xml`), per-page canonical/`og:*`/`twitter:*` meta, JSON-LD (`WebSite`,
`TechArticle` + `BreadcrumbList`), build-time OG cards (one 1200×630 PNG per page via
`astro-og-canvas`, bundled Inter fonts → offline/hermetic), and a full favicon/PWA set
(`node scripts/gen-icons.mjs`). `src/lib/seo.ts` is the single source of truth for the site
identity, OG route key, canonical URLs, the page list, and the JSON-LD builders.

## Run locally

```bash
npm install      # if npm prompts about install scripts, approve esbuild + sharp
npm run dev      # dev server at http://localhost:4321/prepkit/
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

- **`ci.yml`** — on PRs / non-main pushes: `npm ci` → `astro check` → viz smoke test →
  code-runner test → driver-generator test → `build` → internal-link check. **CI is
  hermetic** — the tests mock the network and the execution API is never called in the build
  or CI.
- **`deploy.yml`** — on push to `main`: builds with `withastro/action` and deploys to GitHub
  Pages.

**One-time setup:** repo **Settings → Pages → Build and deployment → Source = "GitHub
Actions"**. After that, every push to `main` — including just adding a note or `.cpp` file —
rebuilds and redeploys.

## Copyright

LeetCode problem **statements** are copyrighted and are **not** reproduced. Pages show only
facts (number, title, difficulty, pattern), a link to the official problem, my own
notes/solutions, and short **original** summaries. The provenance of AI-authored content is
recorded in `NEEDS_REVIEW.md`.

## See also

- `PLAN.md` — the v2-platform design (sections, relocation, per-problem layout, nav, rebrand).
- `PROGRESS.md` — build log + what to check first, preview, and the merge command.
- `NEEDS_REVIEW.md` — everything AI-authored/unverified and decisions to check.
