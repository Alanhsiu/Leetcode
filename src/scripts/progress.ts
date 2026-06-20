// Client-side per-problem progress tracking via localStorage.
// Status values: "solved" | "review" | "confident" (or absent).
// UI wiring is delegation-based so it works for any number of controls on a page.

export type Status = "solved" | "review" | "confident";
const KEY = "dsa-progress";

type Store = Record<string, Status>;

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {}
}

export function getAll(): Store {
  return read();
}

export function getStatus(slug: string): Status | undefined {
  return read()[slug];
}

export function setStatus(slug: string, status: Status | null) {
  const store = read();
  if (status === null) delete store[slug];
  else store[slug] = status;
  write(store);
  document.dispatchEvent(new CustomEvent("progress-changed", { detail: { slug, status } }));
}

const LABELS: Record<Status, string> = {
  solved: "Solved",
  review: "Needs review",
  confident: "Confident",
};
const SYMBOLS: Record<Status, string> = { solved: "✓", review: "↻", confident: "★" };
const DOT_CLASS: Record<Status, string> = {
  solved: "status-solved",
  review: "status-review",
  confident: "status-confident",
};

/** Reflect stored status onto all controls + indicators currently in the DOM. */
export function refreshUI(root: ParentNode = document) {
  const store = read();

  root.querySelectorAll<HTMLElement>("[data-progress-slug]").forEach((ctrl) => {
    const slug = ctrl.dataset.progressSlug!;
    const status = store[slug];
    ctrl.querySelectorAll<HTMLButtonElement>("[data-progress-set]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.progressSet === status));
    });
  });

  root.querySelectorAll<HTMLElement>("[data-progress-indicator]").forEach((el) => {
    const slug = el.dataset.progressIndicator!;
    const status = store[slug];
    el.className = `progress-dot ${status ? DOT_CLASS[status] : "muted"}`;
    el.textContent = status ? SYMBOLS[status] : "○";
    el.title = status ? LABELS[status] : "Not started";
    el.setAttribute("aria-label", status ? LABELS[status] : "Not started");
    if (status) el.dataset.status = status;
    else delete el.dataset.status;
  });
}

function init() {
  // Click delegation for status buttons (toggle off if already set)
  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-progress-set]");
    if (!btn) return;
    const ctrl = btn.closest<HTMLElement>("[data-progress-slug]");
    if (!ctrl) return;
    const slug = ctrl.dataset.progressSlug!;
    const next = btn.dataset.progressSet as Status;
    const current = getStatus(slug);
    setStatus(slug, current === next ? null : next);
    refreshUI();
  });

  document.addEventListener("progress-changed", () => refreshUI());
  // React to changes from other tabs.
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) refreshUI();
  });

  refreshUI();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
