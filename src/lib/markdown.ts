// Render markdown (cheat sheets, reference docs) to HTML at build time,
// with Shiki-highlighted fenced code blocks.
import { Marked } from "marked";
import { highlightCode } from "./highlight";

// One configured instance, reused across renders. walkTokens highlights every
// fenced code block asynchronously and stashes the HTML on the token; the
// custom `code` renderer then emits it.
const marked = new Marked({
  gfm: true,
  breaks: false,
  async: true,
});

marked.use({
  async walkTokens(token) {
    if (token.type === "code") {
      const lang = (token.lang || "").trim().split(/\s+/)[0] || "text";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (token as any)._html = await highlightCode(token.text, lang);
    }
  },
  renderer: {
    code(token) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html = (token as any)._html as string | undefined;
      if (html) return `<div class="code-block">${html}</div>`;
      return `<div class="code-block"><pre><code>${escapeHtml(token.text)}</code></pre></div>`;
    },
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function renderMarkdown(md: string): Promise<string> {
  return (await marked.parse(md)) as string;
}

/** Strip markdown to plain text for search indexing / excerpts. */
export function markdownToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
