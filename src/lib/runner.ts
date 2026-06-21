// ---------------------------------------------------------------------------
// Code-execution client.
//
// ONE public entry point: `runCode({ language, version?, files, stdin? })`.
// The execution backend lives behind a small `Provider` interface; to swap it
// (e.g. to a self-hosted Piston/Judge0), change `RUNNER` below — nothing else.
//
// Default backend: **Wandbox** (wandbox.org). It is free, public, CORS-enabled
// (`Access-Control-Allow-Origin: *`), and runs C++/Python/JS uniformly. Browser
// calls use `Content-Type: text/plain` so they stay a CORS "simple request" and
// skip the preflight Wandbox doesn't answer; Wandbox parses the JSON body anyway.
//
// The public emkc.org **Piston** endpoint went whitelist-only on 2026-02-15
// (HTTP 401), so it can't be the default — but the adapter is kept and the base
// URL is configurable, so pointing at a self-hosted/whitelisted Piston is a
// one-line change.
//
// This module is environment-agnostic (no DOM/Astro imports) so it can be unit
// tested in Node with a mocked `fetch`. The API is only ever called at runtime
// from the visitor's browser — never during build, tests, or CI.
// ---------------------------------------------------------------------------

export type RunnerLanguage = "cpp" | "python" | "javascript";

export interface RunFile {
  name: string;
  content: string;
}

export interface RunRequest {
  language: RunnerLanguage;
  /** Optional concrete compiler/runtime id; falls back to the routing default. */
  version?: string;
  /** Entry point is files[0]; further files are passed as additional sources. */
  files: RunFile[];
  stdin?: string;
}

export interface RunResult {
  /** Compiled (if applicable) and exited 0. */
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal?: string | null;
  /** Compiler diagnostics (errors and/or warnings), when the backend reports them. */
  compileMessage?: string;
  /** Client-measured elapsed wall time, round-trip — includes network + queue. */
  timeMs: number;
  provider: string;
  language: RunnerLanguage;
}

export type RunnerErrorKind =
  | "network" // request never completed (offline, DNS, CORS)
  | "timeout" // exceeded the client timeout
  | "rate-limit" // 429 from the backend
  | "http" // non-2xx from the backend
  | "unsupported" // language has no configured provider
  | "empty"; // no source to run

export class RunnerError extends Error {
  kind: RunnerErrorKind;
  status?: number;
  constructor(kind: RunnerErrorKind, message: string, status?: number) {
    super(message);
    this.name = "RunnerError";
    this.kind = kind;
    this.status = status;
  }
}

/** Friendly, user-facing message for an error thrown by `runCode`. */
export function friendlyError(err: unknown): string {
  if (err instanceof RunnerError) {
    switch (err.kind) {
      case "network":
        return "Couldn't reach the code sandbox. Check your connection and try again.";
      case "timeout":
        return "The run took too long and was stopped. Simplify the input and retry.";
      case "rate-limit":
        return "The public sandbox is rate-limiting requests. Wait a moment and try again.";
      case "http":
        return `The sandbox returned an error${err.status ? ` (HTTP ${err.status})` : ""}. Try again shortly.`;
      case "unsupported":
        return err.message;
      case "empty":
        return "There's no code to run.";
    }
  }
  return "Something went wrong running this code. Try again.";
}

export const LANGUAGE_LABELS: Record<RunnerLanguage, string> = {
  cpp: "C++",
  python: "Python",
  javascript: "JavaScript",
};

/** Short, honest note shown near every runner UI. */
export const SANDBOX_NOTE =
  "Runs in a free public sandbox (Wandbox). Output and timing include network latency; don't paste secrets.";

const DEFAULT_TIMEOUT_MS = 45_000;

// ---------------------------------------------------------------------------
// Provider interface + adapters
// ---------------------------------------------------------------------------

interface Provider {
  name: string;
  run(req: RunRequest, id: string, signal: AbortSignal): Promise<Omit<RunResult, "timeMs" | "provider" | "language">>;
}

/** Parse an exit-code-ish value into a number | null. */
function toExit(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isNaN(n) ? null : n;
}

async function readBodySafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ---- Wandbox -------------------------------------------------------------
// POST https://wandbox.org/api/compile.json
// Request:  { compiler, code, codes?, stdin?, options?, save:false }
// Response: { status, signal?, compiler_output?, compiler_error?,
//             program_output?, program_error? }
export const WANDBOX_BASE = "https://wandbox.org";

// C++ standard flags, passed via Wandbox's comma-separated `options` switch names.
const WANDBOX_CPP_OPTIONS = "warning,gnu++17";

const wandboxProvider: Provider = {
  name: "wandbox",
  async run(req, id, signal) {
    const [entry, ...rest] = req.files;
    const body: Record<string, unknown> = {
      compiler: id,
      code: entry.content,
      stdin: req.stdin ?? "",
      save: false,
    };
    if (rest.length) body.codes = rest.map((f) => ({ file: f.name, code: f.content }));
    if (req.language === "cpp") body.options = WANDBOX_CPP_OPTIONS;

    let res: Response;
    try {
      res = await fetch(`${WANDBOX_BASE}/api/compile.json`, {
        method: "POST",
        // text/plain keeps this a CORS "simple request" (no preflight).
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(body),
        signal,
      });
    } catch (e) {
      if ((e as Error)?.name === "AbortError") throw new RunnerError("timeout", "Run timed out.");
      throw new RunnerError("network", "Network request failed.");
    }
    if (res.status === 429) throw new RunnerError("rate-limit", "Rate limited.", 429);
    if (!res.ok) throw new RunnerError("http", `Backend error ${res.status}.`, res.status);

    const j = (await readBodySafe(res)) as Record<string, string> | null;
    if (!j) throw new RunnerError("http", "Malformed response from sandbox.", res.status);

    const compileMessage = (j.compiler_error || j.compiler_output || "").trim() || undefined;
    const exitCode = toExit(j.status);
    return {
      ok: exitCode === 0,
      stdout: j.program_output ?? "",
      stderr: j.program_error ?? "",
      exitCode,
      signal: j.signal || null,
      compileMessage,
    };
  },
};

// ---- Piston (kept for self-hosted / whitelisted instances) ---------------
// POST {base}/execute
// Request:  { language, version, files:[{name,content}], stdin }
// Response: { run:{stdout,stderr,code,signal}, compile?:{stdout,stderr,code} }
//
// Point this at your own instance to use it (the public emkc.org endpoint is
// whitelist-only as of 2026-02-15):
export const PISTON_BASE = "https://emkc.org/api/v2/piston";

const PISTON_LANG: Record<RunnerLanguage, string> = {
  cpp: "c++",
  python: "python",
  javascript: "javascript",
};

const pistonProvider: Provider = {
  name: "piston",
  async run(req, id, signal) {
    const body = {
      language: PISTON_LANG[req.language],
      version: req.version || id || "*",
      files: req.files.map((f) => ({ name: f.name, content: f.content })),
      stdin: req.stdin ?? "",
    };
    let res: Response;
    try {
      res = await fetch(`${PISTON_BASE}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });
    } catch (e) {
      if ((e as Error)?.name === "AbortError") throw new RunnerError("timeout", "Run timed out.");
      throw new RunnerError("network", "Network request failed.");
    }
    if (res.status === 429) throw new RunnerError("rate-limit", "Rate limited.", 429);
    if (!res.ok) throw new RunnerError("http", `Backend error ${res.status}.`, res.status);

    const j = (await readBodySafe(res)) as
      | { run?: { stdout?: string; stderr?: string; code?: number; signal?: string }; compile?: { stderr?: string; output?: string } }
      | null;
    if (!j || !j.run) throw new RunnerError("http", "Malformed response from sandbox.", res.status);

    const compileMessage = (j.compile?.stderr || j.compile?.output || "").trim() || undefined;
    const exitCode = toExit(j.run.code);
    return {
      ok: exitCode === 0,
      stdout: j.run.stdout ?? "",
      stderr: j.run.stderr ?? "",
      exitCode,
      signal: j.run.signal || null,
      compileMessage,
    };
  },
};

const PROVIDERS: Record<string, Provider> = {
  wandbox: wandboxProvider,
  piston: pistonProvider,
};

// ---------------------------------------------------------------------------
// Backend routing — the ONE place to change to swap execution backends.
// ---------------------------------------------------------------------------
//
// To self-host Piston: set every `provider` to "piston" and `id` to the runtime
// version (or "*"), then set PISTON_BASE above to your instance.
export const RUNNER: Record<RunnerLanguage, { provider: keyof typeof PROVIDERS; id: string }> = {
  cpp: { provider: "wandbox", id: "gcc-13.2.0" },
  python: { provider: "wandbox", id: "cpython-3.13.8" },
  javascript: { provider: "wandbox", id: "nodejs-20.17.0" },
};

/**
 * Compile + run `files` for `language` and return normalized output.
 * Throws {@link RunnerError} on transport/backend failure; a program that
 * compiles but exits non-zero resolves with `ok:false` (not a throw).
 */
export async function runCode(req: RunRequest): Promise<RunResult> {
  const entry = req.files?.[0];
  if (!entry || !entry.content.trim()) throw new RunnerError("empty", "No code to run.");

  const route = RUNNER[req.language];
  if (!route) throw new RunnerError("unsupported", `No sandbox configured for ${req.language}.`);
  const provider = PROVIDERS[route.provider];
  if (!provider) throw new RunnerError("unsupported", `Unknown provider "${route.provider}".`);

  const id = req.version || route.id;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const partial = await provider.run(req, id, controller.signal);
    return { ...partial, timeMs: Date.now() - t0, provider: provider.name, language: req.language };
  } finally {
    clearTimeout(timer);
  }
}
