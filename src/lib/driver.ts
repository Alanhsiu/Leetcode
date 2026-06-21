// ---------------------------------------------------------------------------
// Auto-driver generator for LeetCode-style C++ solutions.
//
// LeetCode solutions are a bare `class Solution { ... };` with no `main()` and
// no definitions for the judge-provided `TreeNode` / `ListNode`, so they can't
// run standalone. This module parses the first public method of `class Solution`
// and synthesizes a self-contained program: harness preamble (headers + the
// standard TreeNode/ListNode when referenced) + the original solution + a
// `main()` that builds **sample** inputs, calls the method, and prints the result.
//
// EVERYTHING THIS PRODUCES IS UNVERIFIED. Sample inputs are heuristic and are not
// the "expected" test cases — the goal is visible output from an editable, runnable
// starting point. See NEEDS_REVIEW.md.
// ---------------------------------------------------------------------------

export interface DriverResult {
  /** True when the driver actually calls the solution method (tiers A/B). */
  runnable: boolean;
  /** True when we appended any driver/harness (false only if code already had main). */
  generated: boolean;
  /** Solution code + harness + main(), ready to send to the runner. */
  fullCode: string;
  /** Sample stdin (currently always ""; inputs are baked into the driver). */
  stdin: string;
  /** Short, user-facing explanation of what was generated. */
  note: string;
}

type CppType =
  | { kind: "int" }
  | { kind: "double" }
  | { kind: "bool" }
  | { kind: "char" }
  | { kind: "string" }
  | { kind: "void" }
  | { kind: "vector"; of: CppType }
  | { kind: "tree" }
  | { kind: "list" }
  | { kind: "unknown"; raw: string };

const KEYWORDS = new Set([
  "if", "for", "while", "switch", "return", "sizeof", "new", "delete",
  "do", "else", "case", "throw", "catch", "static_cast", "dynamic_cast",
  "reinterpret_cast", "const_cast", "decltype", "typeid",
]);

const NOTE = {
  haveMain: "",
  tierA: "Auto-generated driver with sample input — unverified.",
  tierB: "Auto-generated driver (return value isn't auto-printed) — unverified.",
  stub: "Couldn't auto-generate a driver for this signature — edit to add one.",
};

/** Strip C/C++ comments (for parsing only — emitted code keeps comments). */
function stripComments(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
}

/** Index of the delimiter matching the opener at `open`, or -1. */
function matchDelim(s: string, open: number, oc: string, cc: string): number {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === oc) depth++;
    else if (s[i] === cc && --depth === 0) return i;
  }
  return -1;
}

/** Extract the body of `class Solution { ... }` (without the braces). */
function solutionBody(code: string): string | null {
  const m = /\bclass\s+Solution\b/.exec(code);
  if (!m) return null;
  const brace = code.indexOf("{", m.index);
  if (brace < 0) return null;
  const close = matchDelim(code, brace, "{", "}");
  if (close < 0) return null;
  return code.slice(brace + 1, close);
}

interface Method {
  returnType: string;
  name: string;
  params: string; // raw inside-parens text
}

/** Find the first top-level public method definition in a class body. Brace-depth
 *  aware, so it ignores methods inside nested struct/class definitions and skips
 *  over method bodies. */
function firstMethod(body: string): Method | null {
  // Turn access labels into statement delimiters so a return-type slice stops at
  // them and `::` is never mistaken for an access label.
  const work = body.replace(/\b(public|private|protected)\s*:/g, ";");
  const pubIdx = body.search(/\bpublic\s*:/);
  let i = pubIdx >= 0 ? pubIdx : 0;
  let depth = 0;
  let stmtStart = i; // position after the last depth-0 delimiter

  while (i < work.length) {
    const c = work[i];
    if (c === "{") {
      depth++;
      i++;
      if (depth === 0) stmtStart = i;
      continue;
    }
    if (c === "}") {
      depth--;
      i++;
      if (depth === 0) stmtStart = i;
      continue;
    }
    if (depth === 0 && c === ";") {
      i++;
      stmtStart = i;
      continue;
    }
    if (depth === 0 && c === "(") {
      // Identifier immediately before this '(' is the candidate method name.
      let j = i - 1;
      while (j >= 0 && /\s/.test(work[j])) j--;
      const nameEnd = j;
      while (j >= 0 && /\w/.test(work[j])) j--;
      const name = work.slice(j + 1, nameEnd + 1);
      const close = matchDelim(work, i, "(", ")");
      if (close >= 0 && name && !KEYWORDS.has(name) && name !== "Solution") {
        const tail = work.slice(close + 1).match(/^\s*(?:const|noexcept|\s)*\{/);
        if (tail) {
          const returnType = work.slice(stmtStart, j + 1).trim();
          if (returnType) {
            return { returnType, name, params: work.slice(i + 1, close).trim() };
          }
        }
      }
      i = (close >= 0 ? close : i) + 1; // skip past these parens
      continue;
    }
    i++;
  }
  return null;
}

/** A `class Solution` that declares a constructor taking arguments is a design-
 *  style problem we can't auto-`Solution sol;` — caller should stub it. */
function hasParamConstructor(body: string): boolean {
  return /\bSolution\s*\([^)]*\S[^)]*\)/.test(body);
}

/** Normalize a raw C++ type to a value type string (drop const/&). */
function valueType(raw: string): string {
  return raw.replace(/\bconst\b/g, "").replace(/&/g, "").replace(/\s+/g, " ").trim();
}

function classify(raw: string): CppType {
  let t = raw.replace(/\bconst\b/g, "").replace(/&/g, "").replace(/\s+/g, " ").trim();
  // Vector first, so vector<ListNode*> recurses correctly instead of matching
  // the ListNode* check below.
  const vm = t.match(/^(?:std::)?vector\s*<(.+)>$/s);
  if (vm) return { kind: "vector", of: classify(vm[1]) };
  if (/\bTreeNode\b/.test(t) && t.includes("*")) return { kind: "tree" };
  if (/\bListNode\b/.test(t) && t.includes("*")) return { kind: "list" };
  if (t.includes("*")) return { kind: "unknown", raw };
  if (t === "string" || t === "std::string") return { kind: "string" };
  if (t === "bool") return { kind: "bool" };
  if (t === "char") return { kind: "char" };
  if (t === "double" || t === "float" || t === "long double") return { kind: "double" };
  if (/^(unsigned\s+|signed\s+)?(int|long|long long|short|size_t|int64_t|uint32_t|int32_t|uint64_t)$/.test(t))
    return { kind: "int" };
  if (t === "void") return { kind: "void" };
  return { kind: "unknown", raw };
}

interface Param {
  declType: string; // value type for the local declaration
  name: string;
  type: CppType;
}

function parseParams(raw: string): Param[] | null {
  if (!raw.trim()) return [];
  // Split on top-level commas (ignore commas inside <...>).
  const parts: string[] = [];
  let depth = 0, cur = "";
  for (const ch of raw) {
    if (ch === "<") depth++;
    else if (ch === ">") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur);

  const out: Param[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    if (!p || p === "void") continue;
    const nm = p.match(/([A-Za-z_]\w*)\s*$/);
    let name = nm ? nm[1] : `a${i}`;
    let typeRaw = nm ? p.slice(0, nm.index).trim() : p;
    if (!typeRaw) {
      // The whole param was just a type (unnamed) — synthesize a name.
      typeRaw = p;
      name = `a${i}`;
    }
    out.push({ declType: valueType(typeRaw), name, type: classify(typeRaw) });
  }
  return out;
}

/** A C++ literal initializer for a supported type, or null if unsupported. */
function literal(t: CppType, name: string): string | null {
  switch (t.kind) {
    case "int":
      return /target/i.test(name) ? "9" : /^k$/i.test(name) ? "2" : "3";
    case "double":
      return "2.5";
    case "bool":
      return "true";
    case "char":
      return "'a'";
    case "string":
      return '"abc"';
    case "tree":
      return '_lcBuildTree({"3","9","20","null","null","15","7"})';
    case "list":
      return "_lcBuildList({1, 2, 3, 4, 5})";
    case "vector": {
      const e = t.of;
      if (e.kind === "int") return "{2, 7, 11, 15}";
      if (e.kind === "double") return "{1.5, 2.5, 3.5}";
      if (e.kind === "bool") return "{true, false, true}";
      if (e.kind === "char") return "{'a', 'b', 'c'}";
      if (e.kind === "string") return '{"abc", "def"}';
      if (e.kind === "vector") {
        const inner = e.of;
        if (inner.kind === "int") return "{{1, 2, 3}, {4, 5, 6}}";
        if (inner.kind === "char") return "{{'1', '1', '0'}, {'0', '1', '0'}}";
        if (inner.kind === "string") return '{{"a", "b"}, {"c", "d"}}';
      }
      return null;
    }
    default:
      return null;
  }
}

/** Statement(s) to print a value of return type `t` held in `var`, or null. */
function printResult(t: CppType, varName: string): string | null {
  switch (t.kind) {
    case "int":
    case "double":
    case "char":
    case "string":
    case "bool":
    case "vector":
      return `  _lcPrint(${varName});\n  cout << "\\n";`;
    case "tree":
      return `  _lcPrintTree(${varName});\n  cout << "\\n";`;
    case "list":
      return `  _lcPrintList(${varName});\n  cout << "\\n";`;
    default:
      return null;
  }
}

// Whether a return/param tree of types needs the tree/list helpers.
function usesTree(t: CppType): boolean {
  return t.kind === "tree" || (t.kind === "vector" && usesTree(t.of));
}
function usesList(t: CppType): boolean {
  return t.kind === "list" || (t.kind === "vector" && usesList(t.of));
}

const TREE_DEF = `struct TreeNode {
  int val; TreeNode *left; TreeNode *right;
  TreeNode() : val(0), left(nullptr), right(nullptr) {}
  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  TreeNode(int x, TreeNode *l, TreeNode *r) : val(x), left(l), right(r) {}
};`;

const LIST_DEF = `struct ListNode {
  int val; ListNode *next;
  ListNode() : val(0), next(nullptr) {}
  ListNode(int x) : val(x), next(nullptr) {}
  ListNode(int x, ListNode *n) : val(x), next(n) {}
};`;

const PRINT_HELPERS = `template <class T> static void _lcPrint(const T &x) { cout << x; }
static void _lcPrint(bool b) { cout << (b ? "true" : "false"); }
template <class T> static void _lcPrint(const vector<T> &v) {
  cout << "[";
  for (size_t i = 0; i < v.size(); ++i) { if (i) cout << ", "; _lcPrint(v[i]); }
  cout << "]";
}`;

const TREE_HELPERS = `static TreeNode *_lcBuildTree(const vector<string> &a) {
  if (a.empty() || a[0] == "null") return nullptr;
  TreeNode *root = new TreeNode(stoi(a[0]));
  queue<TreeNode *> q; q.push(root); size_t i = 1;
  while (!q.empty() && i < a.size()) {
    TreeNode *n = q.front(); q.pop();
    if (i < a.size() && a[i] != "null") { n->left = new TreeNode(stoi(a[i])); q.push(n->left); } i++;
    if (i < a.size() && a[i] != "null") { n->right = new TreeNode(stoi(a[i])); q.push(n->right); } i++;
  }
  return root;
}
static void _lcPrintTree(TreeNode *root) {
  vector<string> out; queue<TreeNode *> q; if (root) q.push(root);
  while (!q.empty()) {
    TreeNode *n = q.front(); q.pop();
    if (n) { out.push_back(to_string(n->val)); q.push(n->left); q.push(n->right); }
    else out.push_back("null");
  }
  while (!out.empty() && out.back() == "null") out.pop_back();
  cout << "["; for (size_t i = 0; i < out.size(); ++i) { if (i) cout << ", "; cout << out[i]; } cout << "]";
}`;

const LIST_HELPERS = `static ListNode *_lcBuildList(const vector<int> &a) {
  ListNode dummy; ListNode *t = &dummy;
  for (int x : a) { t->next = new ListNode(x); t = t->next; }
  return dummy.next;
}
static void _lcPrintList(ListNode *h) {
  cout << "["; bool f = true;
  while (h) { if (!f) cout << ", "; cout << h->val; f = false; h = h->next; }
  cout << "]";
}`;

const DRIVER_BANNER = "// ===== auto-generated driver (UNVERIFIED — sample input, edit freely) =====";

function assemble(opts: {
  code: string;
  needTreeDef: boolean;
  needListDef: boolean;
  needTreeHelpers: boolean;
  needListHelpers: boolean;
  main: string;
}): string {
  const pre: string[] = [
    "// ===== test harness (auto-generated, UNVERIFIED) =====",
    // Broad, portable header set so solutions that omit includes (relying on the
    // judge's <bits/stdc++.h>) still compile in the sandbox.
    "#include <iostream>",
    "#include <vector>",
    "#include <string>",
    "#include <queue>",
    "#include <stack>",
    "#include <deque>",
    "#include <list>",
    "#include <map>",
    "#include <set>",
    "#include <unordered_map>",
    "#include <unordered_set>",
    "#include <algorithm>",
    "#include <numeric>",
    "#include <climits>",
    "#include <cmath>",
    "#include <functional>",
    "#include <bitset>",
    "#include <array>",
    "#include <utility>",
    "#include <sstream>",
    "using namespace std;",
  ];
  if (opts.needTreeDef) pre.push(TREE_DEF);
  if (opts.needListDef) pre.push(LIST_DEF);
  pre.push(PRINT_HELPERS);

  // The tree/list builders reference TreeNode/ListNode, so they must come AFTER
  // the type definition — which may be ours (above) or the solution's own. Emit
  // them between the solution and main() so either definition is in scope.
  const mid: string[] = [];
  if (opts.needTreeHelpers) mid.push(TREE_HELPERS);
  if (opts.needListHelpers) mid.push(LIST_HELPERS);
  const midStr = mid.length ? `\n\n${mid.join("\n")}` : "";

  return `${pre.join("\n")}\n\n${opts.code.trim()}${midStr}\n\n${DRIVER_BANNER}\n${opts.main}\n`;
}

/**
 * Build a runnable program from a LeetCode-style C++ solution.
 * Never throws — always returns something runnable-or-stubbed.
 */
export function buildDriver(code: string): DriverResult {
  // Already has a main()? Leave it untouched.
  if (/\bint\s+main\s*\(/.test(code)) {
    return { runnable: true, generated: false, fullCode: code, stdin: "", note: NOTE.haveMain };
  }

  const parse = stripComments(code);
  const refsTree = /\bTreeNode\b/.test(parse);
  const refsList = /\bListNode\b/.test(parse);
  const definesTree = /\bstruct\s+TreeNode\b/.test(parse);
  const definesList = /\bstruct\s+ListNode\b/.test(parse);
  const needTreeDef = refsTree && !definesTree;
  const needListDef = refsList && !definesList;

  const body = solutionBody(parse);
  // Design-style class (constructor takes args) → can't auto-construct it.
  const designClass = body ? hasParamConstructor(body) : false;
  const method = body && !designClass ? firstMethod(body) : null;
  const params = method ? parseParams(method.params) : null;

  // ---- Tier C: couldn't parse a callable method → compiling stub. ----
  if (!method || !params) {
    const main = `int main() {
  // No single-method \`class Solution\` was detected here.
  // Construct inputs, call your code, and print the result, then press Run.
  cout << "Add a driver above main(), then Run.\\n";
  return 0;
}`;
    return {
      runnable: false,
      generated: true,
      fullCode: assemble({ code, needTreeDef, needListDef, needTreeHelpers: false, needListHelpers: false, main }),
      stdin: "",
      note: NOTE.stub,
    };
  }

  const retType = classify(method.returnType);
  const decls: string[] = [];
  let supported = true;
  for (const p of params) {
    const lit = literal(p.type, p.name);
    if (lit === null) {
      supported = false;
      break;
    }
    decls.push(`  ${p.declType} ${p.name} = ${lit};`);
  }

  // ---- Tier C: a parameter type we can't sample → compiling stub. ----
  if (!supported) {
    const main = `int main() {
  Solution sol;
  // A parameter type here isn't auto-sampled. Build the inputs for
  // Solution::${method.name}(...), call it, and print the result, then Run.
  cout << "Add inputs for ${method.name}(...), then Run.\\n";
  return 0;
}`;
    return {
      runnable: false,
      generated: true,
      fullCode: assemble({ code, needTreeDef, needListDef, needTreeHelpers: false, needListHelpers: false, main }),
      stdin: "",
      note: NOTE.stub,
    };
  }

  const callArgs = params.map((p) => p.name).join(", ");
  const needTreeHelpers = params.some((p) => usesTree(p.type)) || usesTree(retType);
  const needListHelpers = params.some((p) => usesList(p.type)) || usesList(retType);

  let callAndPrint: string;
  let note: string;
  if (retType.kind === "void") {
    // Print the first vector/string argument (commonly modified in place).
    const arg0 = params[0];
    const printable = arg0 && (arg0.type.kind === "vector" || arg0.type.kind === "string");
    const tail = printable
      ? `  cout << "${arg0.name} -> ";\n  _lcPrint(${arg0.name});\n  cout << "\\n";`
      : `  cout << "(returns void)\\n";`;
    callAndPrint = `  sol.${method.name}(${callArgs});\n${tail}`;
    note = NOTE.tierA;
  } else {
    const printStmt = printResult(retType, "ans");
    callAndPrint = `  auto ans = sol.${method.name}(${callArgs});\n` +
      (printStmt ?? `  (void)ans;\n  cout << "(ran; return type not auto-printed)\\n";`);
    note = printStmt ? NOTE.tierA : NOTE.tierB;
  }

  const main = `int main() {
  Solution sol;
${decls.join("\n")}
${callAndPrint}
  return 0;
}`;

  return {
    runnable: true,
    generated: true,
    fullCode: assemble({ code, needTreeDef, needListDef, needTreeHelpers, needListHelpers, main }),
    stdin: "",
    note,
  };
}
