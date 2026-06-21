// CodeMirror 6 editor factory. This module is loaded **lazily** (dynamic import)
// by <CodeRunner> only when an editor actually needs to mount, so CodeMirror is
// code-split out of the global bundle. A plain <textarea> is the fallback until
// (and if) this mounts.
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";

export type EditorLanguage = "cpp" | "python" | "javascript";

export interface Editor {
  getValue(): string;
  setValue(v: string): void;
  setDark(dark: boolean): void;
  focus(): void;
  destroy(): void;
}

function langExtension(lang: EditorLanguage) {
  if (lang === "cpp") return cpp();
  if (lang === "python") return python();
  return javascript();
}

export function createEditor(opts: {
  parent: HTMLElement;
  doc: string;
  language: EditorLanguage;
  dark: boolean;
  onRun?: () => void;
  /** Accessible name for the editable region (a11y: ARIA textbox needs a name). */
  label?: string;
}): Editor {
  const theme = new Compartment();
  const baseTheme = EditorView.theme({
    "&": { backgroundColor: "transparent", fontSize: "0.84rem" },
    ".cm-content": { fontFamily: "var(--font-mono)" },
    ".cm-gutters": { backgroundColor: "transparent", border: "none" },
    ".cm-scroller": { minHeight: "8rem", maxHeight: "30rem", lineHeight: "1.6" },
    "&.cm-focused": { outline: "none" },
  });
  // Ctrl/Cmd+Enter runs.
  const runKey = keymap.of([
    {
      key: "Mod-Enter",
      run: () => {
        opts.onRun?.();
        return true;
      },
    },
  ]);

  const view = new EditorView({
    parent: opts.parent,
    state: EditorState.create({
      doc: opts.doc,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        langExtension(opts.language),
        EditorView.lineWrapping,
        baseTheme,
        runKey,
        EditorView.contentAttributes.of({ "aria-label": opts.label ?? "Code editor" }),
        theme.of(opts.dark ? oneDark : []),
      ],
    }),
  });

  return {
    getValue: () => view.state.doc.toString(),
    setValue: (v: string) =>
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } }),
    setDark: (dark: boolean) => view.dispatch({ effects: theme.reconfigure(dark ? oneDark : []) }),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}
