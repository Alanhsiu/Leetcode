import type { APIRoute } from "astro";
import { getProblems, getCheatsheets, getReference } from "../lib/content";
import { markdownToText } from "../lib/markdown";
import { href } from "../lib/url";

interface SearchDoc {
  kind: string;
  title: string;
  url: string;
  difficulty?: string;
  patterns?: string[];
  text: string;
}

function clip(s: string, n = 500): string {
  return s.length > n ? s.slice(0, n) : s;
}

export const GET: APIRoute = () => {
  const docs: SearchDoc[] = [];

  for (const p of getProblems()) {
    docs.push({
      kind: "problem",
      title: `${p.number}. ${p.title}`,
      url: href(`/problems/${p.routeSlug}`),
      difficulty: p.difficulty,
      patterns: p.patterns,
      text: clip(`${p.patterns.join(" ")} ${p.timeComplexity ?? ""} ${p.code}`, 600),
    });
  }

  for (const c of getCheatsheets()) {
    docs.push({
      kind: "cheatsheet",
      title: `${c.title} (${c.group})`,
      url: href(`/cheatsheets/${c.slug}`),
      patterns: [c.group],
      text: clip(c.isCode ? c.body : markdownToText(c.body)),
    });
  }

  for (const r of getReference()) {
    docs.push({
      kind: "reference",
      title: r.title,
      url: href(`/reference/${r.slug}`),
      patterns: ["C++ STL"],
      text: clip(markdownToText(r.body)),
    });
  }

  return new Response(JSON.stringify(docs), {
    headers: { "content-type": "application/json" },
  });
};
