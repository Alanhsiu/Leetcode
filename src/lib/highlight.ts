// Build-time syntax highlighting via Shiki with a dual (light/dark) theme.
// A single highlighter instance is reused across the whole build.
import { createHighlighter, type Highlighter } from "shiki";

let hlPromise: Promise<Highlighter> | null = null;

const LANGS = ["cpp", "c", "bash", "json", "python", "text"];

function getHighlighter(): Promise<Highlighter> {
  if (!hlPromise) {
    hlPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: LANGS,
    });
  }
  return hlPromise;
}

/** Highlight a code string to dual-theme HTML (a <pre class="shiki">…). */
export async function highlightCode(code: string, lang = "cpp"): Promise<string> {
  const hl = await getHighlighter();
  const safeLang = hl.getLoadedLanguages().includes(lang as never) ? lang : "text";
  return hl.codeToHtml(code, {
    lang: safeLang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}
