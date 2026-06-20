// Lazily mounts an interactive visualization into a container element.
// The full visualization registry is implemented in Phase 3
// (src/scripts/viz/index.ts). This loader code-splits each viz so a page only
// downloads the animation it actually shows.

export async function mountViz(el: HTMLElement, id: string): Promise<void> {
  try {
    const { renderViz } = await import("./viz/index.ts");
    renderViz(el, id);
  } catch (e) {
    el.innerHTML = `<div class="viz muted text-sm">Visualization unavailable.</div>`;
    console.error("viz mount failed", id, e);
  }
}
