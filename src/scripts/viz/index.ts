// Visualization registry. Fully implemented in Phase 3.
export function renderViz(el: HTMLElement, id: string): void {
  el.innerHTML = `<div class="viz muted text-sm">Visualization “${id}” coming soon.</div>`;
}
