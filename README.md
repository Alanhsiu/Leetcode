# DSA Interview Notes

A fast, visual, searchable site built from my personal LeetCode / interview-prep
notes. C++ solutions, NeetCode 150 coverage, C++ STL reference, topic cheat sheets,
and a library of interactive algorithm **visualizations** — with full-text search,
pattern/difficulty filters, a cram mode, and per-problem progress tracking.

- **Live:** https://alanhsiu.github.io/Leetcode/
- **Stack:** [Astro](https://astro.build) 5 + TypeScript (static output), Tailwind CSS v4, Shiki, Fuse.js.

## Content sources (read-only)

The site is **driven by** four folders. They are treated as read-only content
sources — the build reads them; nothing writes to them:

| Folder | What it holds | Becomes |
| --- | --- | --- |
| `NeetCode 150/` | C++ solutions `<num>. <Title>.cpp` | problem pages |
| `Misc/` | more C++ solutions (same format) | problem pages |
| `Interview Cheat Sheet/` | `.md` (CS / EDA / GPU / HW) + one `.cpp` | cheat sheets |
| `CommonUsage/` | C++ STL `.md` references | reference pages |

**Adding a note is zero-config:** drop a new `<number>. <Title>.cpp` into
`NeetCode 150/` or `Misc/` (or a `.md` into the other two folders) and push — the
build discovers it via a glob, parses the title/number/complexity, looks up its
difficulty & pattern, renders a syntax-highlighted page, indexes it for search,
and slots it into the relevant pattern + NeetCode 150 grid automatically.

## Architecture

```
astro.config.mjs        site + base (/Leetcode), Tailwind
src/
  lib/content.ts        the pipeline: import.meta.glob(?raw) over the 4 folders
  lib/highlight.ts      Shiki dual-theme C++ highlighting
  lib/markdown.ts       marked + Shiki for cheat sheets / reference
  lib/patterns.ts       18 patterns ↔ which visualization each embeds
  data/neetcode150.ts   factual NeetCode 150 list (number/title/difficulty/slug/category)
  data/extraProblems.ts factual metadata for non-NC150 problems
  data/aiSolutions*.ts   AI-authored coverage for NC150 problems I haven't noted (flagged)
  scripts/viz/          the visualization engine (base.ts) + 18 animations
  scripts/progress.ts   localStorage progress (solved / review / confident)
  components/           Header, SearchOverlay, ProblemCard, CodeBlock, …
  pages/                routes (see below)
scripts/linkcheck.mjs   internal broken-link checker (used in CI)
scripts/viz-smoke.mjs   fake-DOM test that steps every frame of every viz
```

**Routes:** `/` · `/problems` (filterable) · `/problems/<n>-<slug>` · `/patterns` +
`/patterns/<slug>` · `/neetcode150` · `/visualizations` · `/cheatsheets` (+ pages) ·
`/reference` (+ pages) · `/cram` · `/dashboard`.

### Notable bits
- **Search**: a build-time `/search-index.json` + a Fuse.js overlay (press `/`).
- **Progress**: stored in `localStorage`; surfaced as status dots everywhere and a `/dashboard`.
- **Visualizations**: framework-free SVG, code-split, with play/pause/step/speed,
  keyboard control, and `prefers-reduced-motion` support. Auto-embedded per pattern.
- **Dark mode** is the default; a no-flash inline script restores the saved theme.

## Run locally

```bash
npm install      # if npm prompts about install scripts, approve esbuild + sharp
                 #   (already recorded under "allowScripts" in package.json)
npm run dev      # dev server at http://localhost:4321/Leetcode/
```

Other scripts:

```bash
npm run build      # static build into dist/
npm run preview    # serve the built site
npm run check      # astro type-check (0 errors required)
npm run linkcheck  # fail on any broken internal link (run after build)
npm run viz-test   # mount every visualization and step every frame
```

## CI / CD

Two GitHub Actions workflows (`.github/workflows/`):

- **`ci.yml`** — on pull requests (and non-main pushes): `npm ci` → `astro check`
  → visualization smoke test → `build` → internal-link check. The PR fails on a
  broken link or a type/build error.
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
**original** summaries plus an AI-authored solution clearly badged
**“AI-generated”** and listed in `NEEDS_REVIEW.md`.

## See also

- `PLAN.md` — design decisions and site map.
- `PROGRESS.md` — build log + how to preview and merge.
- `NEEDS_REVIEW.md` — everything AI-authored/unverified and decisions to check.
