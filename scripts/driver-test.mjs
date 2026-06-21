#!/usr/bin/env node --experimental-strip-types
// Hermetic test for the auto-driver generator (src/lib/driver.ts).
// Reads the local C++ corpus from disk (no network) and asserts invariants over
// every file, plus a few specific cases. Also prints driver coverage stats.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildDriver } from "../src/lib/driver.ts";

const ROOT = process.cwd();
const FOLDERS = ["NeetCode 150", "Misc"];

const files = [];
for (const f of FOLDERS) {
  for (const name of readdirSync(join(ROOT, f))) {
    if (name.endsWith(".cpp")) files.push({ name, path: join(ROOT, f, name) });
  }
}
assert.ok(files.length > 100, `expected the C++ corpus, found ${files.length} files`);

const count = (s, sub) => s.split(sub).length - 1;
// Mirror the generator: ignore commented-out code (e.g. LeetCode's commented
// `struct TreeNode` boilerplate) when detecting real definitions.
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

let runnable = 0, stub = 0, haveMain = 0, fail = 0;
for (const { name, path } of files) {
  const code = readFileSync(path, "utf8");
  let r;
  try {
    r = buildDriver(code);
  } catch (e) {
    fail++;
    console.error(`  ✗ threw on ${name}: ${e.message}`);
    continue;
  }
  // Invariant: exactly one main() in the produced program.
  assert.equal(count(r.fullCode, "int main("), 1, `${name}: expected exactly one main()`);

  if (!r.generated) {
    haveMain++;
  } else if (r.runnable) {
    runnable++;
    assert.ok(r.fullCode.includes("Solution sol;"), `${name}: runnable driver must construct Solution`);
  } else {
    stub++;
  }

  // If the solution references TreeNode/ListNode without defining it (ignoring
  // commented-out boilerplate), the driver must supply exactly one definition so
  // the program compiles — and never a duplicate.
  const realCode = stripComments(code);
  const realFull = stripComments(r.fullCode);
  const refsTree = /\bTreeNode\b/.test(realCode);
  const definesTree = /\bstruct\s+TreeNode\b/.test(realCode);
  if (r.generated && refsTree && !definesTree) {
    assert.ok(realFull.includes("struct TreeNode"), `${name}: must define TreeNode`);
  }
  assert.ok(count(realFull, "struct TreeNode {") <= 1, `${name}: TreeNode defined twice`);
  assert.ok(count(realFull, "struct ListNode {") <= 1, `${name}: ListNode defined twice`);
}

// ---- specific cases ----
function driverFor(file) {
  for (const f of FOLDERS) {
    try {
      return buildDriver(readFileSync(join(ROOT, f, file), "utf8"));
    } catch {}
  }
  throw new Error(`missing fixture ${file}`);
}

const twoSum = driverFor("1. Two Sum.cpp");
assert.ok(twoSum.runnable, "Two Sum should be runnable");
assert.ok(twoSum.fullCode.includes("sol.twoSum("), "Two Sum should call twoSum");
assert.ok(twoSum.fullCode.includes("int target = 9"), "Two Sum target heuristic = 9");
assert.ok(twoSum.fullCode.includes("_lcPrint("), "Two Sum should print the vector result");

console.log(`\nDriver coverage over ${files.length} C++ files:`);
console.log(`  runnable (calls the solution): ${runnable}`);
console.log(`  stub (couldn't auto-build):    ${stub}`);
console.log(`  already had main():            ${haveMain}`);
if (fail) {
  console.error(`\n✗ ${fail} file(s) threw.`);
  process.exit(1);
}
console.log(`\n✓ Driver generator: no throws, invariants hold across the corpus.`);
