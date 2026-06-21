# PLAN — PrepKit v2 platform

> Transform the existing Astro 5 + TypeScript static site (formerly "DSA Notes", a
> LeetCode-focused notes site) into **PrepKit**, a general-purpose interview-prep
> platform. Branch `feature/v2-platform`. `main` untouched — owner merges. Build stays
> green; commit per phase; CI hermetic (no execution-API calls in build/CI).
>
> Earlier rebuild history (the original Astro migration, the code runner, the learning
> platform, and the SEO/polish pass) lives in `PROGRESS.md`. This file is the plan for the
> v2-platform transformation only.

## Goal & guardrails

- **Brand:** display name **PrepKit**; repo slug **prepkit**; `base: '/prepkit'`,
  `site: 'https://alanhsiu.github.io'`.
- **Preserve every original note.** The four former content folders ("NeetCode 150",
  "Misc", "Interview Cheat Sheet", "CommonUsage") are now editable — relocate with
  `git mv` so history is kept; never lose content.
- **Copyright:** never reproduce LeetCode statements verbatim. Original short summaries +
  official link only. Facts (title/number/difficulty/pattern) are fine.
- **Provenance:** no on-page "AI" badges; record the source of every standard answer
  (mine vs AI-generated) in `NEEDS_REVIEW.md` for batch verification.

---

## 1. New section / content model

PrepKit is organized into top-level **sections**. Two kinds:

| Section | Kind | Source | Notes |
|---|---|---|---|
| **Coding** | specialized | `coding/**/*.cpp` (glob pipeline) + curated metadata | Problems, NeetCode 150, Patterns, Visualizations, Playground, Cram, Dashboard. Keeps its own coding-specific intro. |
| **System Design** | notes | `content/system-design/**/*.{md,mdx}` | Drop-in markdown notes. |
| **Behavioral** | notes | `content/behavioral/**/*.{md,mdx}` | Drop-in markdown notes. |
| **Learning** | notes | `content/learning/<track>/**` | Existing multi-track guides (Temporal/Mender/GCP). |
| **Reference** | reference | `reference/cheatsheets/**` + `reference/cpp/*.md` (glob pipeline) | Relocated Interview Cheat Sheet + CommonUsage. |

### The ONE documented "notes" structure (System Design, Behavioral, Learning)

A single generalized **`notes`** Content-Layer collection replaces the `learning`-only
collection. It globs `content/**/*.{md,mdx}`. For any file `content/<section>/<...>/<name>.md`:

- **section** = first path segment (or frontmatter `section:` override).
- **group** (optional) = second-level folder when the note is nested
  (`content/<section>/<group>/<name>.md`); flat sections simply omit it. This generalizes
  Learning's "track" concept to all sections — a track is just a group.
- **landing** = `<section>/index.md` (section intro) and `<section>/<group>/index.md`
  (group intro), surfaced as the auto-outline header.
- **frontmatter** (zod-validated): `title` (required), `description`, `level?`
  (Beginner/Intermediate/Advanced), `order` (sort), `tags[]`, `aiGenerated`, plus optional
  `section`/`group` overrides.

**Zero-wiring rule:** drop a `.md`/`.mdx` file into a section folder → a page appears with
no code changes. Create a new top-level folder under `content/` → a new section appears in
nav and on the home page (with a humanized title fallback if it has no registry entry).
A `sections.ts` registry supplies nice title/blurb/icon/order; missing entries fall back
gracefully. Documented in README → "Add a note / add a section".

### Routes

One generic set of dynamic routes powers every notes section (replacing the
`/learning/*`-specific pages, but keeping the same URL shapes so links/SEO are stable):

- `/[section]` — section hub (landing intro + auto outline of groups → notes).
- `/[section]/[...slug]` — a note, or a group landing.

Existing `learning` URLs (`/learning/temporal/durable-execution`, etc.) are preserved
because `section = learning`. Coding and Reference keep their dedicated specialized routes.

---

## 2. Relocating the four folders (`git mv`, history preserved)

```
NeetCode 150/*.cpp          → coding/neetcode-150/*.cpp
Misc/*.cpp                  → coding/misc/*.cpp
Interview Cheat Sheet/<g>/* → reference/cheatsheets/<g>/*
CommonUsage/*.md            → reference/cpp/*.md
```

Top-level layout after the move:

```
content/            # notes collection (md/mdx) — drop-in sections
  system-design/    behavioral/    learning/<track>/
coding/             # raw .cpp problem store (import.meta.glob) — drop-in problems
  neetcode-150/*.cpp    misc/*.cpp
reference/          # relocated cheat sheets + C++ reference (import.meta.glob)
  cheatsheets/<group>/*.{md,cpp}    cpp/*.md
```

Each is drop-in: add a `.cpp` to `coding/` → a problem page; add an `.md` to `reference/`
→ a reference/cheat-sheet page. `src/lib/content.ts` glob paths update to the new homes;
nothing else about the parsing changes. Verified by the link-checker (every relocated note
must still render and be reachable).

---

## 3. Per-problem layout: Standard Solution + My Solution

Every coding problem page shows two clearly separated parts:

- **(a) Standard Solution** — a clean canonical reference: original 1–2 sentence summary,
  approach, C++ code, time/space complexity. Present on **every** problem.
- **(b) My Solution** — my original note/code, surfaced where I have one (the 152 from the
  `.cpp` store). For the ~36 problems I never solved, only the Standard Solution shows.

Data model:

- Extend `Problem` with `standard?: { summary, approach, code, time, space, source }` and
  keep my parsed `.cpp` as `mySolution` (`code`, parsed complexity).
- A new sharded store `src/data/standardSolutions/*.ts` (like `aiSolutionsA-D`) keyed by
  LeetCode slug holds the Standard for each problem. For the ~36 AI-only problems the
  existing `AI_SOLUTIONS` entry *is* the Standard (reused, not duplicated).
- `source: "mine-cleaned" | "ai"` records provenance for **every** Standard in
  `NEEDS_REVIEW.md` by problem id, so the owner can verify in batches.
- Copyright: Standard summaries are original paraphrases; the official LeetCode link stays.

The collapsible **"▶ Run it"** playground keeps working — it runs against the Standard (or
My, where present) solution via the existing `buildDriver` + `<CodeRunner>`.

> **Volume note:** ~188 problems each need a Standard. The AI-only 36 are already covered.
> The remaining ~152 are authored from a cleaned version of my own solution where possible,
> else an original reference. This is generated in batches across Phase 2; each batch keeps
> the build green and is logged in `NEEDS_REVIEW.md`.

---

## 4. Navigation redesign (fix the overflow bug)

Current bug: ~11 flat top-level links + buttons on one row → horizontal scroll, "Learning"
cut off. Redesign:

- **Desktop (≥ md):** ~5 section entries, two of them accessible **dropdown menus**:
  - **Coding ▾** → Problems · NeetCode 150 · Patterns · Visualizations · Playground · Cram
  - **System Design** · **Behavioral** · **Learning** (direct links)
  - **Reference ▾** → Cheat Sheets · C++ Reference
  - Right cluster: Search · Theme · Dashboard (icon). Dashboard moves out of the main row.
  - Dropdowns: open on hover **and** focus/click, `aria-expanded`, Esc to close, full
    keyboard nav. Nothing wraps or scrolls horizontally.
- **Mobile (< md):** hamburger → vertical accordion of the same sections (groups expandable).
- Verified at **360 / 768 / 1280 / 1920 px**: no horizontal overflow, "Learning" visible.

The section list is derived from the same `sections.ts` registry, so a new section folder
shows up in nav automatically.

---

## 5. Rebrand checklist (PrepKit, base `/prepkit`)

- `astro.config.mjs`: `base: '/prepkit'`, `site: 'https://alanhsiu.github.io'`.
- `package.json` `name` → `prepkit`.
- `src/lib/seo.ts`: `SITE_NAME` → **PrepKit**; broaden `SITE_DESCRIPTION` to interview-prep
  platform; author/publisher unchanged.
- `src/components/Header.astro`: logo text → PrepKit.
- `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`: brand/title/meta.
- `public/site.webmanifest`, `public/robots.txt`: name + sitemap host path.
- `src/pages/rss.xml.ts`: feed title/description.
- `scripts/linkcheck.mjs`, `src/lib/url.ts` comment: `/Leetcode` → `/prepkit`.
- `README.md`: rebrand + new architecture.
- OG images regenerate with the new brand at build time.
- All internal links already route through `href()`/`BASE_URL`; sitemap/RSS/canonical
  follow `site`+`base` automatically.
- Home hero: broaden from "Data Structures & Algorithms" to the full platform; the Coding
  section keeps its own coding-specific intro.

---

## 6. Execution phases (commit per phase, build green each)

0. **Explore & plan** — this file. ✅
1. **Generalize + relocate** — generic `notes` collection + `sections.ts` + generic section
   routes; `git mv` the four folders; update globs; seed System Design + Behavioral; document
   drop-in. Build green.
2. **Standard + My Solution** — two-part problem layout + `standardSolutions` store; cover
   all problems; runner intact; provenance in NEEDS_REVIEW. Build green.
3. **Nav + hero** — responsive grouped nav (no overflow at any width); generalized hero.
4. **Rebrand** — PrepKit + base `/prepkit` everywhere; regenerate OG/icons.
5. **CI/CD & docs** — hermetic CI; README/PLAN/PROGRESS/NEEDS_REVIEW; self-review loop until
   clean; push branch (main untouched).

## Self-review gate (Phase 5)

`astro check` 0 errors · viz/runner/driver tests pass · `npm run build` green ·
`npm run linkcheck` 0 broken · every relocated note renders & is reachable · every problem
shows Standard (+ My where it exists) · nav has zero horizontal overflow at 360/768/1280/1920 ·
search/tags/cram/progress/viz/runner work across all sections · OG/sitemap/RSS/manifest/icons
regenerate under the new base.
