#!/usr/bin/env node --experimental-strip-types
// Hermetic unit test for the code-execution client (src/lib/runner.ts).
// `fetch` is mocked, so this NEVER touches the network — safe to run in CI.
// It verifies request shaping (compiler ids, options, stdin, content-type) and
// response normalization for the Wandbox + Piston adapters, plus error mapping.
import assert from "node:assert/strict";
import { runCode, RunnerError, RUNNER } from "../src/lib/runner.ts";

let lastCall = null;
function mockFetch(impl) {
  globalThis.fetch = async (url, init) => {
    lastCall = { url, init, body: init?.body ? JSON.parse(init.body) : undefined };
    return impl(url, init);
  };
}
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });
}

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}\n    ${e.message}`);
    process.exitCode = 1;
  }
}

// 1. C++ success: maps stdout/exit/compileMessage; sends correct request.
await test("wandbox C++ success → normalized result + correct request", async () => {
  mockFetch(() => jsonResponse({ status: "0", program_output: "42\n", compiler_error: "warning: x" }));
  const r = await runCode({ language: "cpp", files: [{ name: "main.cpp", content: "int main(){}" }], stdin: "5\n" });
  assert.equal(r.ok, true);
  assert.equal(r.stdout, "42\n");
  assert.equal(r.exitCode, 0);
  assert.equal(r.provider, "wandbox");
  assert.ok(r.compileMessage?.includes("warning"));
  assert.ok(typeof r.timeMs === "number");
  // request shape
  assert.ok(String(lastCall.url).includes("wandbox.org/api/compile.json"));
  assert.equal(lastCall.init.method, "POST");
  assert.match(lastCall.init.headers["Content-Type"], /text\/plain/); // no-preflight
  assert.equal(lastCall.body.compiler, "gcc-13.2.0");
  assert.equal(lastCall.body.options, "warning,gnu++17");
  assert.equal(lastCall.body.stdin, "5\n");
  assert.equal(lastCall.body.save, false);
});

// 2. C++ compile error: program didn't run → ok:false, exit!=0, compile message.
await test("wandbox C++ compile error → ok:false + compileMessage", async () => {
  mockFetch(() => jsonResponse({ status: "1", compiler_error: "error: expected ';'", program_output: "" }));
  const r = await runCode({ language: "cpp", files: [{ name: "main.cpp", content: "int main(){x}" }] });
  assert.equal(r.ok, false);
  assert.equal(r.exitCode, 1);
  assert.equal(r.stdout, "");
  assert.ok(r.compileMessage?.includes("error"));
});

// 3. Python routes to cpython, forwards stdin, sends NO C++ options.
await test("wandbox Python → cpython id, stdin, no options", async () => {
  mockFetch(() => jsonResponse({ status: "0", program_output: "10\n" }));
  const r = await runCode({ language: "python", files: [{ name: "main.py", content: "print(10)" }], stdin: "1 2 3" });
  assert.equal(r.stdout, "10\n");
  assert.equal(lastCall.body.compiler, "cpython-3.13.8");
  assert.equal(lastCall.body.stdin, "1 2 3");
  assert.equal(lastCall.body.options, undefined);
});

// 4. JavaScript routes to nodejs.
await test("wandbox JavaScript → nodejs id", async () => {
  mockFetch(() => jsonResponse({ status: "0", program_output: "2,4,6\n" }));
  await runCode({ language: "javascript", files: [{ name: "main.js", content: "console.log(1)" }] });
  assert.equal(lastCall.body.compiler, "nodejs-20.17.0");
});

// 5. `version` overrides the routing default.
await test("explicit version overrides default compiler id", async () => {
  mockFetch(() => jsonResponse({ status: "0", program_output: "" }));
  await runCode({ language: "cpp", version: "gcc-12.3.0", files: [{ name: "main.cpp", content: "int main(){}" }] });
  assert.equal(lastCall.body.compiler, "gcc-12.3.0");
});

// 6. Network failure → RunnerError("network").
await test("fetch throws → RunnerError network", async () => {
  mockFetch(() => { throw new Error("ECONNREFUSED"); });
  await assert.rejects(
    runCode({ language: "cpp", files: [{ name: "main.cpp", content: "int main(){}" }] }),
    (e) => e instanceof RunnerError && e.kind === "network",
  );
});

// 7. Non-200 → RunnerError("http") with status.
await test("HTTP 500 → RunnerError http", async () => {
  mockFetch(() => new Response("nope", { status: 500 }));
  await assert.rejects(
    runCode({ language: "cpp", files: [{ name: "main.cpp", content: "int main(){}" }] }),
    (e) => e instanceof RunnerError && e.kind === "http" && e.status === 500,
  );
});

// 8. HTTP 429 → RunnerError("rate-limit").
await test("HTTP 429 → RunnerError rate-limit", async () => {
  mockFetch(() => new Response("slow down", { status: 429 }));
  await assert.rejects(
    runCode({ language: "cpp", files: [{ name: "main.cpp", content: "int main(){}" }] }),
    (e) => e instanceof RunnerError && e.kind === "rate-limit",
  );
});

// 9. Empty code → RunnerError("empty") without any fetch.
await test("empty code → RunnerError empty (no fetch)", async () => {
  mockFetch(() => { throw new Error("should not be called"); });
  await assert.rejects(
    runCode({ language: "cpp", files: [{ name: "main.cpp", content: "   " }] }),
    (e) => e instanceof RunnerError && e.kind === "empty",
  );
});

// 10. Backend swap: flip routing to Piston and verify the Piston adapter mapping.
await test("swap to Piston adapter → maps run.{stdout,code}", async () => {
  const saved = { ...RUNNER.cpp };
  RUNNER.cpp = { provider: "piston", id: "*" };
  try {
    mockFetch(() => jsonResponse({ run: { stdout: "hi\n", stderr: "", code: 0 }, compile: { stderr: "" } }));
    const r = await runCode({ language: "cpp", files: [{ name: "main.cpp", content: "int main(){}" }], stdin: "x" });
    assert.equal(r.provider, "piston");
    assert.equal(r.stdout, "hi\n");
    assert.equal(r.exitCode, 0);
    assert.ok(String(lastCall.url).includes("/execute"));
    assert.equal(lastCall.body.language, "c++");
    assert.equal(lastCall.body.stdin, "x");
  } finally {
    RUNNER.cpp = saved;
  }
});

console.log(process.exitCode ? `\n✗ runner tests failed` : `\n✓ All ${passed} runner tests passed (hermetic, no network).`);
