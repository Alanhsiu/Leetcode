// Stack — Valid Parentheses. Push openers, pop on a matching closer.
import { createViz, type Step } from "./base.ts";
import { cell, text, C } from "./svg.ts";

interface S extends Step {
  i: number; // current char index (-1 before start, n at end)
  stack: string[]; // current stack contents (bottom -> top)
  action: "start" | "push" | "pop" | "mismatch" | "valid";
  popChar: string | null; // char popped this step (for highlight)
}

export default function stack(container: HTMLElement) {
  const input = "([{}])";
  const chars = input.split("");
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const steps: S[] = [];

  const st: string[] = [];
  steps.push({
    caption: `Check if "${input}" is valid. Scan left to right with an empty stack.`,
    i: -1,
    stack: [],
    action: "start",
    popChar: null,
  });

  let valid = true;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === "(" || c === "[" || c === "{") {
      st.push(c);
      steps.push({
        caption: `'${c}' is an opener → push it onto the stack.`,
        i,
        stack: [...st],
        action: "push",
        popChar: null,
      });
    } else {
      const want = pairs[c];
      const top = st[st.length - 1];
      if (top === want) {
        st.pop();
        steps.push({
          caption: `'${c}' closes the top '${top}' → pop. Stack matches so far.`,
          i,
          stack: [...st],
          action: "pop",
          popChar: top,
        });
      } else {
        valid = false;
        steps.push({
          caption: `'${c}' does not match top '${top ?? "∅"}' → invalid.`,
          i,
          stack: [...st],
          action: "mismatch",
          popChar: null,
        });
        break;
      }
    }
  }

  if (valid && st.length === 0) {
    steps.push({
      caption: `End of string and the stack is empty → valid ✓`,
      i: chars.length,
      stack: [],
      action: "valid",
      popChar: null,
    });
  }

  // Layout: input row across the top, stack column on the right.
  const CW = 46, CH = 46, GAP = 8;
  const inputX0 = 30;
  const inputY = 60;

  const stackW = 60, stackH = 44, stackGap = 6;
  const stackX = 410;
  const stackBaseY = 280; // bottom of stack grows upward

  createViz<S>(container, {
    width: 540,
    height: 320,
    steps,
    label: "Valid parentheses checked with a stack",
    draw(layer, s) {
      layer.append(text(180, 26, `Valid Parentheses — "${input}"`, { size: 15, weight: 700 }));

      // Input characters row.
      for (let k = 0; k < chars.length; k++) {
        const x = inputX0 + k * (CW + GAP);
        const isCur = k === s.i;
        const isPast = k < s.i;
        let fill = C.cell;
        if (isCur) fill = s.action === "mismatch" ? C.compare : C.active;
        else if (isPast) fill = C.visited;
        const tf = isCur || isPast ? C.textOn : C.text;
        layer.append(cell(x, inputY, CW, CH, chars[k], { fill, textFill: tf }));
      }

      // Stack label and container baseline.
      layer.append(text(stackX + stackW / 2, inputY - 8, "stack", { size: 13, weight: 700, fill: C.muted }));
      layer.append(
        text(stackX + stackW / 2, stackBaseY + 16, s.stack.length === 0 ? "(empty)" : "↑ top", {
          size: 11,
          fill: C.muted,
        })
      );

      // Stack contents, bottom at baseline, growing up.
      for (let d = 0; d < s.stack.length; d++) {
        const y = stackBaseY - (d + 1) * (stackH + stackGap);
        const isTop = d === s.stack.length - 1;
        layer.append(
          cell(stackX, y, stackW, stackH, s.stack[d], {
            fill: isTop ? C.active : C.highlight,
            textFill: C.textOn,
          })
        );
      }

      // Show the popped element fading-style above the stack as a "done" marker.
      if (s.action === "pop" && s.popChar) {
        const y = stackBaseY - (s.stack.length + 1) * (stackH + stackGap);
        layer.append(
          cell(stackX, y, stackW, stackH, s.popChar, {
            fill: C.done,
            textFill: C.textOn,
          })
        );
        layer.append(text(stackX + stackW + 8, y + stackH / 2, "popped", { size: 11, fill: C.done, anchor: "start", weight: 700 }));
      }

      if (s.action === "valid") {
        layer.append(text(180, inputY + CH + 40, "VALID ✓", { size: 22, weight: 700, fill: C.done }));
      } else if (s.action === "mismatch") {
        layer.append(text(180, inputY + CH + 40, "INVALID ✗", { size: 22, weight: 700, fill: C.compare }));
      }
    },
  });
}
