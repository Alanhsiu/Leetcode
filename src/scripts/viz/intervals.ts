// Merge Intervals: sweep sorted intervals on a number line, merging overlaps.
import { createViz, type Step } from "./base.ts";
import { line, text, el, C } from "./svg.ts";

interface S extends Step {
  considered: number;            // index of interval being examined (-1 = none)
  merged: [number, number][];    // emitted/finalized merged intervals
  current: [number, number] | null; // in-progress merge interval
  overlap: boolean | null;       // outcome of the current comparison
}

export default function intervals(container: HTMLElement) {
  const input: [number, number][] = [
    [1, 3],
    [2, 6],
    [8, 10],
    [9, 12],
    [15, 18],
  ];

  // Number-line mapping: value -> pixel x.
  const vMin = 0;
  const vMax = 20;
  const axisX0 = 40;
  const axisX1 = 540;
  const xOf = (v: number): number => axisX0 + ((v - vMin) / (vMax - vMin)) * (axisX1 - axisX0);

  const steps: S[] = [];
  const snap = (
    caption: string,
    considered: number,
    merged: [number, number][],
    current: [number, number] | null,
    overlap: boolean | null
  ) => {
    steps.push({
      caption,
      considered,
      merged: merged.map((m) => [m[0], m[1]] as [number, number]),
      current: current ? [current[0], current[1]] : null,
      overlap,
    });
  };

  snap("Sort intervals by start value (already sorted here): " + input.map((i) => `[${i[0]},${i[1]}]`).join(" "), -1, [], null, null);

  const merged: [number, number][] = [];
  let current: [number, number] = [input[0][0], input[0][1]];
  snap(`Start current merge = [${current[0]},${current[1]}] from the first interval.`, 0, merged, current, null);

  for (let i = 1; i < input.length; i++) {
    const [s, e] = input[i];
    const overlaps = s <= current[1];
    if (overlaps) {
      const newEnd = Math.max(current[1], e);
      snap(
        `[${s},${e}] starts at ${s} ≤ ${current[1]} (current end) → overlap. Extend current to [${current[0]},${newEnd}].`,
        i,
        merged,
        [current[0], newEnd],
        true
      );
      current = [current[0], newEnd];
    } else {
      snap(
        `[${s},${e}] starts at ${s} > ${current[1]} (current end) → no overlap. Emit [${current[0]},${current[1]}].`,
        i,
        merged,
        current,
        false
      );
      merged.push([current[0], current[1]]);
      current = [s, e];
      snap(`Emitted. Start new current merge = [${current[0]},${current[1]}].`, i, merged, current, null);
    }
  }

  merged.push([current[0], current[1]]);
  snap(`End of list → emit the final current interval [${current[0]},${current[1]}].`, -1, merged, null, null);
  snap(`Done. Merged result: ${merged.map((m) => `[${m[0]},${m[1]}]`).join(" ")}.`, -1, merged, null, null);

  const barH = 18;
  const inputY0 = 70;
  const rowGap = 26;
  const axisY = 250;
  const mergedY = 280;

  function bar(x0: number, x1: number, y: number, fill: string, stroke: string): SVGGElement {
    const g = el("g");
    g.append(
      el("rect", {
        x: x0,
        y,
        width: Math.max(x1 - x0, 3),
        height: barH,
        rx: 5,
        fill,
        stroke,
        "stroke-width": 1.5,
      })
    );
    return g;
  }

  createViz<S>(container, {
    width: 560,
    height: 330,
    steps,
    label: "Merge overlapping intervals via a left-to-right sweep",
    draw(layer, s) {
      // Input bars, one per row.
      for (let i = 0; i < input.length; i++) {
        const [a, b] = input[i];
        const y = inputY0 + i * rowGap;
        const isConsidered = i === s.considered;
        let fill = C.cell;
        if (isConsidered) fill = s.overlap === false ? C.compare : C.active;
        layer.append(bar(xOf(a), xOf(b), y, fill, C.stroke));
        layer.append(
          text(xOf(a) - 8, y + barH / 2, `[${a},${b}]`, {
            anchor: "end",
            size: 10,
            mono: true,
            weight: 600,
            fill: isConsidered ? C.text : C.muted,
          })
        );
      }

      // Number-line axis.
      layer.append(line(axisX0, axisY, axisX1, axisY, { stroke: C.stroke, width: 2 }));
      for (let v = vMin; v <= vMax; v += 2) {
        const x = xOf(v);
        layer.append(line(x, axisY - 4, x, axisY + 4, { stroke: C.stroke, width: 1.5 }));
        layer.append(text(x, axisY + 14, String(v), { size: 9, fill: C.muted }));
      }

      // Current in-progress merge: highlighted overlay near the axis.
      if (s.current) {
        const [a, b] = s.current;
        layer.append(bar(xOf(a), xOf(b), axisY - 26, C.active, C.stroke));
        layer.append(
          text((xOf(a) + xOf(b)) / 2, axisY - 26 + barH / 2, `current [${a},${b}]`, {
            size: 9,
            weight: 700,
            mono: true,
            fill: C.textOn,
          })
        );
      }

      // Finalized merged intervals row (done color).
      layer.append(text(axisX0 - 8, mergedY + barH / 2, "merged", { anchor: "end", size: 10, weight: 700 }));
      for (const [a, b] of s.merged) {
        layer.append(bar(xOf(a), xOf(b), mergedY, C.done, C.stroke));
        layer.append(
          text((xOf(a) + xOf(b)) / 2, mergedY + barH / 2, `[${a},${b}]`, {
            size: 9,
            weight: 700,
            mono: true,
            fill: C.textOn,
          })
        );
      }
    },
  });
}
