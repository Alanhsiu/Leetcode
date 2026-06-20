// Hashing — Two Sum with a hash map (value -> index). One pass.
import { createViz, type Step } from "./base.ts";
import { cell, text, C } from "./svg.ts";

interface MapRow { key: number; idx: number; }

interface S extends Step {
  i: number; // current index being processed
  complement: number;
  map: MapRow[]; // rows present in the hash map at this step
  hitKey: number | null; // complement found -> highlight this map key
  pair: [number, number] | null; // final answer indices
  phase: "start" | "check" | "found" | "insert";
}

export default function hashing(container: HTMLElement) {
  const arr = [2, 7, 11, 15];
  const target = 9;
  const steps: S[] = [];

  const map = new Map<number, number>();
  const rows = (): MapRow[] => [...map.entries()].map(([key, idx]) => ({ key, idx }));

  steps.push({
    caption: `Two Sum: find indices summing to ${target}. Use a hash map of value → index.`,
    i: -1,
    complement: 0,
    map: [],
    hitKey: null,
    pair: null,
    phase: "start",
  });

  let solved = false;
  for (let i = 0; i < arr.length && !solved; i++) {
    const complement = target - arr[i];
    steps.push({
      caption: `i = ${i}: need complement ${target} − ${arr[i]} = ${complement}. Look it up in the map.`,
      i,
      complement,
      map: rows(),
      hitKey: null,
      pair: null,
      phase: "check",
    });

    if (map.has(complement)) {
      const j = map.get(complement) as number;
      steps.push({
        caption: `Found ${complement} at index ${j}! Answer = [${j}, ${i}]  (${arr[j]} + ${arr[i]} = ${target}) ✓`,
        i,
        complement,
        map: rows(),
        hitKey: complement,
        pair: [j, i],
        phase: "found",
      });
      solved = true;
    } else {
      map.set(arr[i], i);
      steps.push({
        caption: `${complement} not in map → insert ${arr[i]} → ${i} and move on.`,
        i,
        complement,
        map: rows(),
        hitKey: null,
        pair: null,
        phase: "insert",
      });
    }
  }

  // Array layout.
  const W = 58, H = 58, GAP = 10;
  const totalW = arr.length * W + (arr.length - 1) * GAP;
  const x0 = 30;
  const arrY = 80;

  // Map table layout (right side).
  const mapX = 360;
  const mapTop = 78;
  const rowH = 34;
  const keyW = 70, valW = 70;

  createViz<S>(container, {
    width: 540,
    height: 300,
    steps,
    label: "Two Sum solved with a hash map",
    draw(layer, s) {
      layer.append(text(180, 28, `Two Sum  ·  target = ${target}`, { size: 15, weight: 700 }));

      // Array cells.
      for (let k = 0; k < arr.length; k++) {
        const x = x0 + k * (W + GAP);
        const isCur = k === s.i;
        const inPair = s.pair !== null && (k === s.pair[0] || k === s.pair[1]);
        let fill = C.cell;
        if (inPair) fill = C.done;
        else if (isCur) fill = C.active;
        else if (s.map.some((r) => r.idx === k)) fill = C.visited;
        const tf = fill === C.cell ? C.text : C.textOn;
        layer.append(cell(x, arrY, W, H, String(arr[k]), { fill, textFill: tf }));
        layer.append(text(x + W / 2, arrY - 12, String(k), { size: 11, fill: C.muted, mono: true }));
      }

      // Complement readout.
      if (s.phase !== "start") {
        layer.append(
          text(x0, arrY + H + 28, `complement = ${target} − ${arr[s.i]} = ${s.complement}`, {
            size: 13,
            anchor: "start",
            weight: 600,
            fill: s.phase === "found" ? C.done : C.text,
          })
        );
      }

      // Hash map table header.
      layer.append(text(mapX + keyW / 2, mapTop - 14, "value", { size: 12, weight: 700, fill: C.muted }));
      layer.append(text(mapX + keyW + valW / 2, mapTop - 14, "index", { size: 12, weight: 700, fill: C.muted }));

      if (s.map.length === 0) {
        layer.append(text(mapX + (keyW + valW) / 2, mapTop + rowH / 2, "(empty map)", { size: 12, fill: C.muted }));
      }

      for (let r = 0; r < s.map.length; r++) {
        const row = s.map[r];
        const y = mapTop + r * (rowH + 6);
        const hit = s.hitKey !== null && row.key === s.hitKey;
        const fill = hit ? C.done : C.highlight;
        layer.append(cell(mapX, y, keyW, rowH, String(row.key), { fill, textFill: C.textOn, fontSize: 14 }));
        layer.append(cell(mapX + keyW, y, valW, rowH, String(row.idx), { fill, textFill: C.textOn, fontSize: 14 }));
        if (hit) {
          layer.append(text(mapX + keyW + valW + 8, y + rowH / 2, "match!", { size: 11, anchor: "start", weight: 700, fill: C.done }));
        }
      }

      if (s.pair !== null) {
        layer.append(
          text(180, arrY + H + 58, `Answer: [${s.pair[0]}, ${s.pair[1]}]`, {
            size: 18,
            weight: 700,
            fill: C.done,
          })
        );
      }
    },
  });
}
