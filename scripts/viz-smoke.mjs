#!/usr/bin/env node --experimental-strip-types
// Smoke test for visualizations: mounts each module under a minimal fake DOM
// and steps through EVERY frame, catching runtime errors that type-checking
// can't (null derefs, bad indexing, etc.). Run: node scripts/viz-smoke.mjs
const created = [];

class FakeClassList {
  #s = new Set();
  add(...c) { c.forEach((x) => this.#s.add(x)); }
  remove(...c) { c.forEach((x) => this.#s.delete(x)); }
  toggle(c, force) { const has = this.#s.has(c); const on = force ?? !has; on ? this.#s.add(c) : this.#s.delete(c); return on; }
  contains(c) { return this.#s.has(c); }
}

class FakeEl {
  constructor(tag) {
    this.tagName = tag;
    this.attributes = {};
    this.children = [];
    this.style = {};
    this.classList = new FakeClassList();
    this.dataset = {};
    this.listeners = {};
    this._text = "";
    this.value = "";
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; }
  removeAttribute(k) { delete this.attributes[k]; }
  append(...nodes) { for (const n of nodes) this.children.push(typeof n === "string" ? new FakeText(n) : n); }
  appendChild(n) { this.children.push(n); return n; }
  removeChild(n) { const i = this.children.indexOf(n); if (i >= 0) this.children.splice(i, 1); return n; }
  get firstChild() { return this.children[0] ?? null; }
  set innerHTML(v) { this._html = v; this.children = []; }
  get innerHTML() { return this._html ?? ""; }
  set textContent(v) { this._text = String(v); this.children = []; }
  get textContent() { return this._text; }
  addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); }
  removeEventListener() {}
  dispatch(type, evt = {}) { (this.listeners[type] || []).forEach((fn) => fn({ preventDefault() {}, ...evt })); }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  focus() {}
  scrollIntoView() {}
}
class FakeText { constructor(t) { this._text = t; } }

function makeEl(tag) { const e = new FakeEl(tag); created.push(e); return e; }

globalThis.document = {
  createElement: makeEl,
  createElementNS: (_ns, tag) => makeEl(tag),
  createTextNode: (t) => new FakeText(t),
  documentElement: new FakeEl("html"),
  addEventListener() {},
  body: new FakeEl("body"),
};
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} };
globalThis.window = globalThis;

const IDS = [
  "two-pointers", "sliding-window", "binary-search", "linked-list", "stack",
  "hashing", "tree-traversal", "trie", "heap", "graph-traversal",
  "topological-sort", "dijkstra", "union-find", "backtracking", "intervals",
  "greedy", "dp-1d", "dp-2d",
];

let failures = 0;
for (const id of IDS) {
  created.length = 0;
  try {
    const mod = await import(`../src/scripts/viz/${id}.ts`);
    const container = makeEl("div");
    mod.default(container);
    // find the range input (the step slider) and drive every frame
    const slider = created.find((e) => e.tagName === "input" && e.type === "range");
    if (!slider) throw new Error("no step slider created — createViz not invoked?");
    const max = Number(slider.attributes.max ?? slider.max ?? 0);
    let frames = 0;
    for (let i = 0; i <= max; i++) {
      slider.value = String(i);
      slider.dispatch("input");
      frames++;
    }
    if (frames < 2) throw new Error(`only ${frames} frame(s)`);
    console.log(`  ✓ ${id.padEnd(18)} ${max + 1} frames`);
  } catch (e) {
    failures++;
    console.error(`  ✗ ${id.padEnd(18)} ${e?.stack?.split("\n").slice(0, 3).join("\n     ") ?? e}`);
  }
}

console.log(failures ? `\n✗ ${failures} visualization(s) failed.` : `\n✓ All ${IDS.length} visualizations render every frame without errors.`);
process.exit(failures ? 1 : 0);
