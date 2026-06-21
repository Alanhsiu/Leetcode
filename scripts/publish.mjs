#!/usr/bin/env node
// One-command publish:  npm run publish
//
// Stages everything, commits with an auto message — "note: <title> (<date>)" —
// and pushes the current branch. On main this triggers the Pages deploy; on a
// feature branch it just pushes for review. Title is read from the changed note's
// frontmatter (falls back to a generic message when no single note is obvious).
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

function git(args, opts = {}) {
  return execFileSync("git", args, { encoding: "utf8", ...opts }).trim();
}

function titleOf(path) {
  try {
    if (!existsSync(path)) return null;
    const text = readFileSync(path, "utf8");
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    const m = fm?.[1].match(/^title:\s*(.+)$/m);
    if (!m) return null;
    return m[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    return null;
  }
}

function main() {
  // Anything to publish?
  const status = git(["status", "--porcelain"]);
  if (!status) {
    console.log("Nothing to publish — working tree is clean.");
    return;
  }

  // Find a representative note title: prefer a newly-added content note.
  const lines = status.split("\n").filter(Boolean);
  const notes = lines
    .map((l) => ({ code: l.slice(0, 2), path: l.slice(3).trim() }))
    .filter((e) => /^content\/.*\.(md|mdx)$/.test(e.path));
  const added = notes.find((e) => e.code.includes("?") || e.code.includes("A"));
  const pick = added || notes[0];
  const title = pick ? titleOf(pick.path) : null;

  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const message = title ? `note: ${title} (${date})` : `notes: update (${date})`;
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);

  git(["add", "-A"]);
  git(["commit", "-m", message], { stdio: "inherit" });
  console.log(`✓ Committed: ${message}`);

  git(["push", "origin", branch], { stdio: "inherit" });
  console.log(`✓ Pushed to origin/${branch}` + (branch === "main" ? " — deploy triggered." : "."));
}

try {
  main();
} catch (err) {
  console.error("✗ Publish failed:", err.message || err);
  process.exit(1);
}
