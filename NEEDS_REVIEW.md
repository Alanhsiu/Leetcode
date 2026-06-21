# NEEDS REVIEW

Items the repo owner should verify. Three classes: (A) AI-generated content I wrote and have **not** verified, (B) copyright-sensitive surfaces, (C) source-data quirks / decisions.

## A. AI-generated content (`aiGenerated: true`)
These 36 NeetCode 150 problems had no note of yours, so the build agent authored an
**original short summary + an approach + a C++ solution** for each. They are tagged
`aiGenerated: true`, badged "⚠ AI-generated" on the site, and were **NOT executed
against the LeetCode judge** — verify correctness before trusting them. Each links as
`/problems/<number>-<slug>`.

**Arrays & Hashing / Two Pointers / Sliding Window / Stack / Binary Search**
- 242 Valid Anagram · 347 Top K Frequent Elements · 271 Encode and Decode Strings · 238 Product of Array Except Self
- 424 Longest Repeating Character Replacement · 239 Sliding Window Maximum (monotonic deque)
- 853 Car Fleet
- 704 Binary Search · 875 Koko Eating Bananas (binary search on answer) · 981 Time Based Key-Value Store

**Linked List / Trees / Heap**
- 287 Find the Duplicate Number (Floyd cycle) · 297 Serialize and Deserialize Binary Tree
- 703 Kth Largest Element in a Stream · 973 K Closest Points to Origin · 355 Design Twitter · 295 Find Median from Data Stream (two heaps)

**Graphs / Advanced Graphs**
- 286 Walls and Gates (multi-source BFS) · 323 Number of Connected Components · 261 Graph Valid Tree
- 778 Swim in Rising Water · 787 Cheapest Flights Within K Stops (Bellman-Ford)

**DP / Greedy / Intervals / Bit**
- 746 Min Cost Climbing Stairs · 300 Longest Increasing Subsequence (O(n log n))
- 332 Reconstruct Itinerary (Hierholzer's algorithm) — added during self-review (see §C)
- 416 Partition Equal Subset Sum · 494 Target Sum · 329 Longest Increasing Path in a Matrix · 312 Burst Balloons (interval DP)
- 846 Hand of Straights · 1899 Merge Triplets to Form Target Triplet · 763 Partition Labels
- 56 Merge Intervals · 435 Non-overlapping Intervals · 1851 Minimum Interval to Include Each Query
- 268 Missing Number · 371 Sum of Two Integers (bit add)

Specific edge-case notes flagged by generation: `target-sum` guards against negative/odd
`total+target`; `non-overlapping-intervals` uses `long` sentinels; `sum-of-two-integers`
does the carry on `unsigned` to avoid signed-overflow UB; `cheapest-flights` snapshots
costs per round to enforce the stop limit. All assume LeetCode's default C++17 includes
and the standard `TreeNode` definition.

## B. Copyright
- No LeetCode problem **statements** are reproduced anywhere. Pages show only facts (number, title, difficulty, pattern), a link to the official problem, your own notes/code, and — where flagged above — my own short original summaries.
- Please confirm you're comfortable with the short original problem summaries shown on problem pages (they paraphrase the task in my own words; they are not LeetCode's text).

## C. Source-data quirks & decisions
Filenames are treated as the source of truth for problem number + title. A few source files appear mislabeled relative to the real LeetCode problem of that number; the site shows them as-named and the official-link slug may therefore not resolve. Confirm whether to relabel (in your read-only folders, which I did not touch):
- `NeetCode 150/20. Diameter of Binary Tree.cpp` — correctly matched by **title** to LeetCode **#543 Diameter of Binary Tree** (it is in the NeetCode 150); only the filename number `20` is wrong, so the page header shows "20." Rename to `543. …` to fix the displayed number. (A correct, separate `20. Valid Parentheses.cpp` also exists and is unaffected.)
- `NeetCode 150/332. Coin Challenge.cpp` — **resolved.** Its function is `coinChange`, so it is actually LeetCode **#322 Coin Change** mislabeled `332`. It is now mapped to the `coin-change` problem, so your own solution is shown (and the AI-generated coin-change is skipped). The page still shows the filename's "332. Coin Challenge" — rename to `322. Coin Change.cpp` to fix. Because this freed up #332, I added an AI-generated **Reconstruct Itinerary** (the real #332) — see §A.
- Decision: a file is treated as *mislabeled* when its number maps to a NeetCode 150 problem whose title doesn't match the filename — in that case it does NOT inherit that problem's metadata/official link (prevents two files claiming one slug). This is why correcting the data above keeps coverage at a *true* 150/150.
- _(any further quirks discovered during the build are appended here)_

---

# PART A/B/C — Online IDE + Learning Platform (added on `feature/online-ide-and-learning`)

## D. Execution provider decision (verify / revisit)
- The brief defaulted to the public **Piston** API. Confirmed on 2026-06-20 that
  `POST https://emkc.org/api/v2/piston/execute` now returns **HTTP 401 — "whitelist
  only as of 2/15/2026"**, so it can't be the default (and self-hosting is out of
  scope: no backend). **Default provider is now Wandbox** (`wandbox.org`), behind a
  swappable abstraction (`src/lib/runner.ts`); `piston` (configurable base URL) and a
  `godbolt` note remain for self-host/whitelist. **Decision to confirm:** OK to depend
  on the free public Wandbox sandbox? It's a community service (rate limits/uptime not
  guaranteed). To swap: edit the `RUNNER` object in `src/lib/runner.ts`.
- Code runs in a **public** sandbox from the visitor's browser — the UI warns not to
  paste secrets. CI/build never call it (hermetic).

## E. Auto-generated problem drivers (`src/lib/driver.ts`) — UNVERIFIED
- Each problem page's **"▶ Run it"** playground appends an **auto-generated `main()`**
  to your solution with **heuristic sample inputs** (e.g. `vector<int> = {2,7,11,15}`,
  `target = 9`, a fixed sample tree/list). These are **not** the LeetCode test cases —
  they exist so "Run" produces visible output; the output is *a* result, not a *checked*
  result. The editor is fully editable and **Reset** restores the generated starting
  point.
- Coverage: of 152 C++ files, **132 get a runnable driver** (verified to compile with
  `clang++` locally) and **20 fall back to a compiling stub** (design-style `Solution`
  with a constructor, `vector<ListNode*>`, custom `Node*`/graph types, etc.) that asks
  you to add a driver. Standard `TreeNode`/`ListNode` definitions are injected only when
  referenced and not already defined.
- AI-authored solutions (the 36 from the prior phase) also get drivers via the same
  mechanism — doubly worth verifying.
- To verify: open a problem, expand **Run it**, press Run, and sanity-check. Report any
  signature that should be runnable but stubs out.

## F. AI-drafted learning guides (`content/learning/**`) — `aiGenerated: true`
All guides below were **drafted by an AI assistant**, are badged "⚠ AI-drafted" on the
site, and are **not verified**. Temporal/Mender/GCP move fast and the assistant's
knowledge has a cutoff — **confirm every command, flag, and claim against official
docs** before relying on them.

- **Temporal** (`docs.temporal.io`): _What is Durable Execution?_, _Workflows &
  Activities_, _Workers & Task Queues_, _Retries & Timeouts_ (+ track landing).
- **Mender** (`docs.mender.io`): _Why OTA Updates Are Hard (A/B Updates)_, _Mender
  Artifacts_, _Deployments & Device Groups_, _State Scripts & Delta Updates_ (+ landing).
- **GCP** (`cloud.google.com/docs`): _Cloud Run_, _GKE_, _Pub/Sub_, _Cloud Storage_,
  _IAM_, _BigQuery_ (+ landing). GCP CLI snippets are **read-only references** (never
  executed in-browser); double-check service names, flags, and pricing claims.

Specific things to sanity-check: Temporal timeout names/semantics and versioning
guidance; Mender state-script state names and delta trade-offs; GCP `gcloud`/`bq` flags,
storage-class minimums, and any cost statements.

## G. Discoverability + polish pass (branch `chore/seo-and-polish`) — judgment calls
Purely technical SEO/a11y/perf polish; **no new content or claims** were authored.

- **"AI-drafted"/"AI-generated" markers removed at your request** ("I already
  checked"). Removed: the on-page badges/banners (problem pages, learning track +
  guide pages, `/cram`, `/learning`) and the "AI-drafted and not yet verified"
  sentences in the three track-landing `index.md` files. The `aiGenerated: true`
  **frontmatter and `aiSolutions*.ts` data remain** as inert metadata (no longer
  rendered anywhere) — §A and §F above still list what was originally AI-authored,
  so this file stays the record of provenance even though the site no longer says so.
  The problem-page "Run it" driver caveat ("auto-generated… unverified", §E) is a
  separate, still-accurate note about the synthesized test harness and was **kept**.
- **robots.txt** sits at `/Leetcode/robots.txt`. Crawlers read `robots.txt` from the
  **domain root** (`alanhsiu.github.io/robots.txt`), which belongs to your user/root
  Pages site, not this project. The `sitemap-index.xml` is still discoverable via the
  `<link rel="sitemap">` in every page and can be submitted directly in Search Console.
- **OG/social images** are generated at build time with `astro-og-canvas`
  (canvaskit-wasm) using **bundled Inter fonts** (`src/assets/og/`), so the build is
  hermetic/offline. One 1200×630 PNG per page (264). Re-run `node scripts/gen-icons.mjs`
  only if the master icon SVG changes; OG images regenerate automatically on build
  (cached under `node_modules/.astro-og-canvas`).
- **Contrast:** light-mode accent darkened to indigo-600 and difficulty-badge text
  darkened so all text clears WCAG AA in **both** themes; the github-dark Shiki comment
  token was lightened (it was 3.9:1 on the dark code bg). Ratios were computed by hand
  for light mode (Lighthouse only exercises the default dark theme).
