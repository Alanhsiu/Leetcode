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

## Phase 3 — Visualizations
- (in progress)
