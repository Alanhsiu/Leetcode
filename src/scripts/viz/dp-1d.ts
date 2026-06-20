// House Robber — 1-D DP: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).
import { createViz, type Step } from "./base.ts";
import { cell, text, C } from "./svg.ts";

interface S extends Step {
  i: number;        // index of dp cell being computed (-1 before start)
  filled: number;   // number of dp cells already finalized (0..n)
  depPrev: number;  // dp index dep i-1, or -1
  depPrev2: number; // dp index dep i-2, or -1
  done: boolean;
}

export default function dp1d(container: HTMLElement) {
  const nums = [2, 7, 9, 3, 1];
  const n = nums.length;
  const dp: number[] = new Array(n).fill(0);
  const steps: S[] = [];

  steps.push({
    caption: `House Robber: maximize loot, no two adjacent houses. dp[i] = best loot using houses 0..i.`,
    i: -1, filled: 0, depPrev: -1, depPrev2: -1, done: false,
  });

  for (let i = 0; i < n; i++) {
    if (i === 0) {
      dp[0] = nums[0];
      steps.push({
        caption: `dp[0] = nums[0] = ${nums[0]} (only one house to rob).`,
        i: 0, filled: 1, depPrev: -1, depPrev2: -1, done: false,
      });
    } else if (i === 1) {
      dp[1] = Math.max(dp[0], nums[1]);
      steps.push({
        caption: `dp[1] = max(dp[0]=${dp[0]}, nums[1]=${nums[1]}) = ${dp[1]}.`,
        i: 1, filled: 2, depPrev: 0, depPrev2: -1, done: false,
      });
    } else {
      const skip = dp[i - 1];
      const take = dp[i - 2] + nums[i];
      dp[i] = Math.max(skip, take);
      steps.push({
        caption: `dp[${i}] = max(dp[${i - 1}]=${skip}, dp[${i - 2}]+${nums[i]}=${take}) = ${dp[i]}.`,
        i, filled: i + 1, depPrev: i - 1, depPrev2: i - 2, done: false,
      });
    }
  }

  steps.push({
    caption: `Answer = dp[${n - 1}] = ${dp[n - 1]} (max loot).`,
    i: n - 1, filled: n, depPrev: -1, depPrev2: -1, done: true,
  });

  const W = 64, H = 50, GAP = 10;
  const totalW = n * W + (n - 1) * GAP;
  const x0 = (560 - totalW) / 2;
  const yNums = 80;
  const yDp = 165;

  createViz<S>(container, {
    width: 560, height: 250, steps, label: "House Robber 1-D DP",
    draw(layer, s) {
      layer.append(text(x0 - 24, yNums + H / 2, "nums", { anchor: "end", size: 12, fill: C.muted, weight: 700 }));
      layer.append(text(x0 - 24, yDp + H / 2, "dp", { anchor: "end", size: 12, fill: C.muted, weight: 700 }));

      for (let i = 0; i < n; i++) {
        const x = x0 + i * (W + GAP);
        layer.append(text(x + W / 2, yNums - 14, String(i), { size: 11, fill: C.muted, mono: true }));

        // nums row
        const numActive = i === s.i;
        layer.append(cell(x, yNums, W, H, String(nums[i]), {
          fill: numActive && s.i >= 0 ? C.highlight : C.cell,
          textFill: numActive && s.i >= 0 ? C.textOn : C.text,
        }));

        // dp row
        let fill = C.cell;
        let textFill = C.muted;
        const isFilled = i < s.filled;
        if (i === s.i) { fill = s.done ? C.done : C.active; textFill = C.textOn; }
        else if (i === s.depPrev || i === s.depPrev2) { fill = C.compare; textFill = C.textOn; }
        else if (isFilled) { fill = C.done; textFill = C.textOn; }
        const label = isFilled ? String(dp[i]) : "·";
        layer.append(cell(x, yDp, W, H, label, { fill, textFill }));
      }

      layer.append(text(280, 34, s.done ? `Answer = ${dp[n - 1]}` : "House Robber", { size: 16, weight: 700 }));
    },
  });
}
