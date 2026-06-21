#!/usr/bin/env node
// One-command note capture:  npm run note -- "What is a service mesh"
//
// Scaffolds a timestamped markdown note in content/notes/, fills in frontmatter
// (title, type, createdAt/updatedAt, tags, plus LeetCode fields), and opens it in
// $EDITOR. The ONLY required input is a title — everything else has a sane default,
// so the everyday flow is: `npm run note -- "..."` → write → `npm run publish`.
//
// Pass the title as an argument, or run with no args to be prompted for it.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NOTES_DIR = join(ROOT, "content", "notes");

/** URL-safe slug — mirrors slugify() in src/lib/url.ts. */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Quote a value for YAML frontmatter, escaping embedded double-quotes. */
function yamlStr(s) {
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function tagList(raw) {
  return (raw || "")
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function conceptTemplate({ title, type, now, tags }) {
  return `---
title: ${yamlStr(title)}
type: ${type}
createdAt: ${now}
updatedAt: ${now}
tags: [${tags.join(", ")}]
---

## Summary

_One or two sentences: what is this and why does it matter._

## Details

## References
`;
}

function leetcodeTemplate({ title, now, tags, problemNumber, difficulty, url }) {
  const heading = problemNumber ? `${problemNumber}. ${title}` : title;
  return `---
title: ${yamlStr(heading)}
type: leetcode
${problemNumber ? `problemNumber: ${problemNumber}\n` : ""}difficulty: ${difficulty}
leetcodeUrl: ${yamlStr(url)}
createdAt: ${now}
updatedAt: ${now}
tags: [${tags.join(", ")}]
---

## Problem

[${heading}](${url})

> Paste the problem statement, or a one-line summary + constraints.

## Approach

_The key insight / pattern, and why it works._

## My solution

\`\`\`cpp
class Solution {
public:

};
\`\`\`

## Complexity

- **Time:** O(?)
- **Space:** O(?)
`;
}

async function main() {
  const argTitle = process.argv.slice(2).join(" ").trim();

  // Two input modes:
  //  - TTY: prompt interactively via readline.
  //  - piped/no stdin: read all of stdin up front and answer prompts from its
  //    lines in order (EOF → use the default). Avoids readline's dangling-promise
  //    behaviour on a closed stdin, and makes the flow scriptable/testable.
  let ask;
  let rl = null;
  if (stdin.isTTY) {
    rl = createInterface({ input: stdin, output: stdout });
    ask = async (q, def = "") => {
      const a = (await rl.question(def ? `${q} [${def}]: ` : `${q}: `)).trim();
      return a || def;
    };
  } else {
    const chunks = [];
    for await (const c of stdin) chunks.push(c);
    const lines = chunks.join("").split("\n");
    let i = 0;
    ask = async (q, def = "") => {
      const a = (i < lines.length ? lines[i++] : "").trim();
      return a || def;
    };
  }

  let title = argTitle;
  if (!title) title = await ask("Title");
  if (!title) {
    console.error("✗ A title is required.");
    rl?.close();
    process.exit(1);
  }

  let type = (await ask("Type (concept | leetcode | other)", "concept")).toLowerCase();
  if (!["concept", "leetcode", "other"].includes(type)) type = "concept";

  const tags = tagList(await ask("Tags (comma/space separated, optional)"));
  const now = new Date().toISOString();

  let content;
  if (type === "leetcode") {
    const numRaw = await ask("LeetCode problem number (optional)");
    const problemNumber = numRaw && /^\d+$/.test(numRaw) ? Number(numRaw) : undefined;
    let difficulty = (await ask("Difficulty (Easy | Medium | Hard)", "Medium")).trim();
    difficulty = ["Easy", "Medium", "Hard"].find((d) => d.toLowerCase() === difficulty.toLowerCase()) || "Medium";
    const defUrl = `https://leetcode.com/problems/${slugify(title)}/`;
    const url = await ask("LeetCode URL", defUrl);
    content = leetcodeTemplate({ title, now, tags, problemNumber, difficulty, url });
  } else {
    content = conceptTemplate({ title, type, now, tags });
  }

  rl?.close();

  // Resolve a non-colliding path: content/notes/<slug>.md (then -2, -3, …).
  mkdirSync(NOTES_DIR, { recursive: true });
  const base = slugify(title) || "note";
  let slug = base;
  let n = 2;
  while (existsSync(join(NOTES_DIR, `${slug}.md`))) slug = `${base}-${n++}`;
  const file = join(NOTES_DIR, `${slug}.md`);
  writeFileSync(file, content, "utf8");

  const rel = file.replace(ROOT + "/", "");
  console.log(`✓ Created ${rel}`);

  // Open in $EDITOR (falls back to common editors); if none, just print the path.
  const editor = process.env.EDITOR || process.env.VISUAL;
  if (editor) {
    spawnSync(editor, [file], { stdio: "inherit", shell: true });
  } else {
    console.log(`  Set $EDITOR to open it automatically. Then: npm run publish`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
