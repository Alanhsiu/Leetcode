// Build-time createdAt/updatedAt derivation for notes.
//
// Every note must be timestamped so the section indexes and /timeline can sort it.
// Frontmatter `createdAt`/`updatedAt` win when present (the CLI writes them). When
// they are ABSENT — e.g. a note dropped in by hand or created via the GitHub web
// editor on a phone — we derive them from git history:
//   - createdAt = the author date of the commit that first ADDED the file
//   - updatedAt = the author date of the most recent commit touching the file
//
// Fallbacks keep the build green no matter what: if git has no history for the
// path (uncommitted sample, or a shallow CI checkout missing the add-commit) we
// fall back to the file's mtime, and finally to build time. CI checks out with
// fetch-depth: 0 so the derivation is accurate there too.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

export interface FileDates {
  createdAt: Date;
  updatedAt: Date;
}

const cache = new Map<string, FileDates>();

function git(args: string[]): string | null {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(+d) ? null : d;
}

/** Resolve createdAt/updatedAt for a note file from git history, with fallbacks. */
export function fileDates(filePath: string): FileDates {
  const abs = resolve(filePath);
  const hit = cache.get(abs);
  if (hit) return hit;

  // First commit that ADDED the file (follow renames); the last line is the oldest.
  let createdAt: Date | null = null;
  const added = git(["log", "--diff-filter=A", "--follow", "--format=%aI", "--", abs]);
  if (added) {
    const lines = added.split("\n").filter(Boolean);
    createdAt = parseDate(lines[lines.length - 1]);
  }

  // Most recent commit touching the file.
  const updatedAt = parseDate(git(["log", "-1", "--format=%aI", "--", abs]));

  // Fallbacks: filesystem mtime, then build time — so a brand-new uncommitted
  // file (e.g. a freshly scaffolded note) still gets a sensible timestamp.
  let mtime: Date | null = null;
  try {
    if (existsSync(abs)) mtime = statSync(abs).mtime;
  } catch {
    /* ignore */
  }
  const fallback = mtime ?? new Date();

  const out: FileDates = {
    createdAt: createdAt ?? fallback,
    updatedAt: updatedAt ?? createdAt ?? fallback,
  };
  cache.set(abs, out);
  return out;
}
