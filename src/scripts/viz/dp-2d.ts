// Longest Common Subsequence — 2-D DP over two strings.
import { createViz, type Step } from "./base.ts";
import { cell, text, line, C } from "./svg.ts";

interface S extends Step {
  i: number;      // current row in dp (1..m), 0 = before start
  j: number;      // current col in dp (1..n), 0 = before start
  filled: boolean[][]; // snapshot of which dp cells are finalized
  vals: number[][];    // snapshot of dp values
  match: boolean;      // chars matched at current cell
  done: boolean;
}

export default function dp2d(container: HTMLElement) {
  const a = "AGCAT"; // labels rows (i = 1..m)
  const b = "GAC";   // labels cols (j = 1..n)
  const m = a.length, nn = b.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(nn + 1).fill(0));
  const filled: boolean[][] = Array.from({ length: m + 1 }, () => new Array(nn + 1).fill(false));
  // Row 0 and col 0 are base cases (zeros), considered filled from the start.
  for (let j = 0; j <= nn; j++) filled[0][j] = true;
  for (let i = 0; i <= m; i++) filled[i][0] = true;

  const snap = (): { f: boolean[][]; v: number[][] } => ({
    f: filled.map((r) => r.slice()),
    v: dp.map((r) => r.slice()),
  });

  const steps: S[] = [];
  let s0 = snap();
  steps.push({
    caption: `LCS of "${a}" and "${b}". Row 0 / col 0 = 0 (empty prefix). Fill row by row.`,
    i: 0, j: 0, filled: s0.f, vals: s0.v, match: false, done: false,
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= nn; j++) {
      const match = a[i - 1] === b[j - 1];
      if (match) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      filled[i][j] = true;
      const sn = snap();
      const cap = match
        ? `a[${i - 1}]='${a[i - 1]}' = b[${j - 1}]='${b[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`
        : `'${a[i - 1]}' != '${b[j - 1]}': dp[${i}][${j}] = max(up=${dp[i - 1][j]}, left=${dp[i][j - 1]}) = ${dp[i][j]}.`;
      steps.push({ caption: cap, i, j, filled: sn.f, vals: sn.v, match, done: false });
    }
  }

  const sf = snap();
  steps.push({
    caption: `Done. LCS length = dp[${m}][${nn}] = ${dp[m][nn]} (bottom-right cell).`,
    i: m, j: nn, filled: sf.f, vals: sf.v, match: false, done: true,
  });

  // Layout: grid columns for j = 0..nn, rows for i = 0..m, plus header row/col for chars.
  const CW = 56, CH = 42, GAP = 6;
  const gridX = 130; // left edge of dp grid (after row char labels)
  const gridY = 70;  // top edge of dp grid (after col char labels)
  const colX = (j: number) => gridX + j * (CW + GAP);
  const rowY = (i: number) => gridY + i * (CH + GAP);

  const width = 560;
  const height = rowY(m) + CH + 30;

  createViz<S>(container, {
    width, height, steps, label: "Longest Common Subsequence 2-D DP",
    draw(layer, s) {
      layer.append(text(width / 2, 28, s.done ? `LCS length = ${s.vals[m][nn]}` : `LCS("${a}", "${b}")`, { size: 16, weight: 700 }));

      // Column character headers for b (above each j = 1..nn). j=0 column shows "ø".
      layer.append(text(colX(0) + CW / 2, gridY - 22, "ø", { size: 13, fill: C.muted, weight: 700 }));
      for (let j = 1; j <= nn; j++) {
        const hi = !s.done && j === s.j && s.match;
        layer.append(text(colX(j) + CW / 2, gridY - 22, b[j - 1], { size: 15, weight: 700, fill: hi ? C.highlight : C.text, mono: true }));
      }
      // Row character headers for a (left of each i = 1..m).
      layer.append(text(gridX - 24, rowY(0) + CH / 2, "ø", { anchor: "end", size: 13, fill: C.muted, weight: 700 }));
      for (let i = 1; i <= m; i++) {
        const hi = !s.done && i === s.i && s.match;
        layer.append(text(gridX - 24, rowY(i) + CH / 2, a[i - 1], { anchor: "end", size: 15, weight: 700, fill: hi ? C.highlight : C.text, mono: true }));
      }

      const isDep = (i: number, j: number): boolean => {
        if (s.done || s.i === 0) return false;
        if (i === s.i && j === s.j) return false;
        if (s.match) return i === s.i - 1 && j === s.j - 1; // diagonal
        return (i === s.i - 1 && j === s.j) || (i === s.i && j === s.j - 1); // up & left
      };

      for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= nn; j++) {
          const x = colX(j), y = rowY(i);
          const current = !s.done ? (i === s.i && j === s.j) : (i === m && j === nn);
          const isFilled = s.filled[i][j];
          let fill = C.cell;
          let textFill = C.muted;
          if (current && s.i > 0) { fill = s.done ? C.done : C.active; textFill = C.textOn; }
          else if (isDep(i, j)) { fill = C.compare; textFill = C.textOn; }
          else if (isFilled) { fill = C.done; textFill = C.textOn; }
          const label = isFilled ? String(s.vals[i][j]) : "";
          layer.append(cell(x, y, CW, CH, label, { fill, textFill, fontSize: 15 }));
        }
      }

      // Diagonal arrow hint when current cell is a match.
      if (!s.done && s.match && s.i > 0 && s.j > 0) {
        const x1 = colX(s.j - 1) + CW / 2, y1 = rowY(s.i - 1) + CH / 2;
        const x2 = colX(s.j) + CW / 2, y2 = rowY(s.i) + CH / 2;
        layer.append(line(x1, y1, x2, y2, { stroke: C.highlight, width: 2, dash: "4 3" }));
      }
    },
  });
}
