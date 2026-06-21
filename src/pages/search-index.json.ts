import type { APIRoute } from "astro";
import { getProblems, getCheatsheets, getReference } from "../lib/content";
import { getNoteInfos } from "../lib/notes";
import { sectionMeta, groupMeta, humanize } from "../data/sections";
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

export const GET: APIRoute = async () => {
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

  for (const n of await getNoteInfos()) {
    if (n.kind !== "note") continue; // skip section + group landings
    const sTitle = sectionMeta(n.section)?.title ?? humanize(n.section);
    const gTitle = n.group ? (groupMeta(n.group)?.title ?? humanize(n.group)) : null;
    const label = gTitle ? `${sTitle} · ${gTitle}` : sTitle;
    const g = n.entry;
    docs.push({
      kind: "note",
      title: `${g.data.title} (${label})`,
      url: href(`/${n.section}/${n.path}`),
      patterns: [sTitle, ...(gTitle ? [gTitle] : []), ...g.data.tags],
      text: clip(`${g.data.description} ${markdownToText(g.body ?? "")}`),
    });
  }

  return new Response(JSON.stringify(docs), {
    headers: { "content-type": "application/json" },
  });
};
