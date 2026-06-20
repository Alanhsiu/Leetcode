#!/usr/bin/env node
// Internal link checker. Scans the built dist/ for internal href/src targets
// and fails (exit 1) if any point to a path that wasn't generated.
// External links (http/https/mailto), in-page anchors, and data: URIs are skipped.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = join(process.cwd(), "dist");
const BASE = "/Leetcode";

if (!existsSync(DIST)) {
  console.error("✗ dist/ not found — run `npm run build` first.");
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

// Does an internal absolute path (already base-stripped) resolve to a file?
function resolves(pathname) {
  // strip query + hash
  let p = pathname.split("#")[0].split("?")[0];
  if (p === "" || p === "/") p = "/index.html";
  const candidates = [
    join(DIST, p),
    join(DIST, p, "index.html"),
    join(DIST, p + ".html"),
    join(DIST, p.replace(/\/$/, "") + "/index.html"),
  ];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
}

const htmlFiles = walk(DIST);
const attrRe = /(?:href|src)\s*=\s*"([^"]*)"/gi;
let broken = [];
let checked = 0;

for (const file of htmlFiles) {
  // Strip <script>/<style> bodies so JS template literals like `href="${x}"`
  // and CSS url()s aren't mistaken for navigable links.
  const html = readFileSync(file, "utf8")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  let m;
  while ((m = attrRe.exec(html))) {
    const link = m[1].trim();
    if (!link) continue;
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/i.test(link)) continue;

    let pathname;
    if (link.startsWith(BASE + "/") || link === BASE) {
      pathname = link.slice(BASE.length) || "/";
    } else if (link.startsWith("/")) {
      // absolute but missing base — that's a bug (won't work under /Leetcode/)
      broken.push({ file: relative(DIST, file), link, reason: "absolute path missing base" });
      continue;
    } else {
      // relative link — resolve against the file's directory
      const dir = "/" + relative(DIST, file).split("/").slice(0, -1).join("/");
      pathname = join(dir, link);
    }

    checked++;
    if (!resolves(pathname)) {
      broken.push({ file: relative(DIST, file), link, reason: "target not found" });
    }
  }
}

console.log(`Checked ${checked} internal links across ${htmlFiles.length} pages.`);
if (broken.length) {
  console.error(`\n✗ ${broken.length} broken internal link(s):`);
  const seen = new Set();
  for (const b of broken) {
    const key = `${b.link} (${b.reason})`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.error(`  - ${b.link}  [${b.reason}]  e.g. in ${b.file}`);
  }
  process.exit(1);
}
console.log("✓ No broken internal links.");
