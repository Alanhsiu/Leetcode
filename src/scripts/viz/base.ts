// Shared visualization engine: a frame-stepper with play/pause/step/reset/speed
// controls, keyboard support, an aria-live caption, and reduced-motion respect.
// Each visualization supplies a list of discrete `steps` and a `draw(layer, step)`
// callback; the engine clears + redraws the SVG layer for each frame.
import { el, group } from "./svg.ts";

export interface Step {
  caption: string;
  [key: string]: unknown;
}

export interface VizSpec<S extends Step = Step> {
  width: number;
  height: number;
  steps: S[];
  draw: (layer: SVGGElement, step: S, index: number) => void;
  /** Optional override for the accessible name of the stage. */
  label?: string;
}

const prefersReducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const SPEEDS = [
  { label: "0.5×", ms: 1700 },
  { label: "1×", ms: 950 },
  { label: "2×", ms: 480 },
  { label: "4×", ms: 240 },
];

function btn(label: string, aria: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.className = "viz-btn";
  b.type = "button";
  b.innerHTML = label;
  b.setAttribute("aria-label", aria);
  return b;
}

export function createViz<S extends Step>(container: HTMLElement, spec: VizSpec<S>): void {
  const { width, height, steps, draw } = spec;
  let index = 0;
  let playing = false;
  let timer: number | undefined;
  let speedIdx = 1;

  container.classList.add("viz");
  container.innerHTML = "";

  // Stage
  const stage = document.createElement("div");
  stage.className = "viz-stage";
  stage.tabIndex = 0;
  stage.setAttribute("role", "img");
  stage.setAttribute("aria-label", spec.label ?? "Algorithm visualization");

  const svg = el("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.style.maxHeight = `${height}px`;
  const layer = group();
  svg.append(layer);
  stage.append(svg);

  // Caption
  const caption = document.createElement("p");
  caption.className = "viz-caption";
  caption.setAttribute("aria-live", "polite");

  // Controls
  const controls = document.createElement("div");
  controls.className = "viz-controls";

  const resetBtn = btn("⏮", "Reset to start");
  const backBtn = btn("◀", "Step back");
  const playBtn = btn("▶", "Play");
  const fwdBtn = btn("▶", "Step forward");
  fwdBtn.innerHTML = "▶❘";

  const counter = document.createElement("span");
  counter.className = "viz-counter muted";

  const progress = document.createElement("input");
  progress.type = "range";
  progress.min = "0";
  progress.max = String(steps.length - 1);
  progress.step = "1";
  progress.className = "viz-progress";
  progress.setAttribute("aria-label", "Step position");

  const speedBtn = btn(SPEEDS[speedIdx].label, "Change speed");
  speedBtn.classList.add("viz-speed");

  controls.append(resetBtn, backBtn, playBtn, fwdBtn, progress, counter, speedBtn);
  container.append(stage, caption, controls);

  function render() {
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    const step = steps[index];
    draw(layer, step, index);
    caption.textContent = step?.caption ?? "";
    counter.textContent = `${index + 1} / ${steps.length}`;
    progress.value = String(index);
    backBtn.disabled = index === 0;
    fwdBtn.disabled = index === steps.length - 1;
  }

  function stop() {
    playing = false;
    if (timer) clearInterval(timer);
    timer = undefined;
    playBtn.innerHTML = "▶";
    playBtn.setAttribute("aria-label", "Play");
    playBtn.setAttribute("aria-pressed", "false");
  }

  function tick() {
    if (index >= steps.length - 1) {
      stop();
      return;
    }
    index++;
    render();
  }

  function play() {
    if (index >= steps.length - 1) index = 0; // replay from start
    playing = true;
    playBtn.innerHTML = "⏸";
    playBtn.setAttribute("aria-label", "Pause");
    playBtn.setAttribute("aria-pressed", "true");
    render();
    timer = window.setInterval(tick, SPEEDS[speedIdx].ms);
  }

  function toggle() {
    if (playing) stop();
    else play();
  }

  function goto(i: number) {
    stop();
    index = Math.max(0, Math.min(steps.length - 1, i));
    render();
  }

  resetBtn.addEventListener("click", () => goto(0));
  backBtn.addEventListener("click", () => goto(index - 1));
  fwdBtn.addEventListener("click", () => goto(index + 1));
  playBtn.addEventListener("click", toggle);
  progress.addEventListener("input", () => goto(Number(progress.value)));
  speedBtn.addEventListener("click", () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    speedBtn.innerHTML = SPEEDS[speedIdx].label;
    if (playing) {
      if (timer) clearInterval(timer);
      timer = window.setInterval(tick, SPEEDS[speedIdx].ms);
    }
  });

  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goto(index + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goto(index - 1); }
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
  });

  // Auto-play once on first scroll into view, unless reduced motion is requested.
  render();
  if (!prefersReducedMotion()) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          io.disconnect();
          if (!playing && index === 0) play();
        }
      }
    }, { threshold: 0.4 });
    io.observe(container);
  }
}
