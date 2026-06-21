// Central SEO / discoverability helpers. One source of truth for:
//   - the site identity (name, default description, social handle),
//   - canonical / absolute URL construction (respects `site` + `base`),
//   - the OG-image route key for any page (so BaseLayout and the image
//     generator agree on where a page's social image lives),
//   - the full list of pages (title + description + kind), reused by the
//     OG-image route, the RSS feed, and per-page structured data.
import { getProblems, getCheatsheets, getReference } from "./content";
import { PATTERNS } from "./patterns";
import { VISUALIZATIONS } from "./patterns";
import { getLearning, getTrackViews, trackSlug, guideSlug, isLanding } from "./learning";
import { trackMeta, humanizeTrack } from "../data/tracks";
import { href } from "./url";

export const SITE_NAME = "DSA Interview Notes";
export const SITE_DESCRIPTION =
  "A fast, visual, searchable collection of data-structures & algorithms interview notes, NeetCode 150 coverage, interactive algorithm visualizations, an in-browser code runner, and concept guides for Temporal, Mender, and Google Cloud.";
export const SITE_URL = "https://alanhsiu.github.io";

/** A page known to the site, used for OG images, RSS and structured data. */
export interface PageInfo {
  /** OG-image route key, e.g. "problems/1-two-sum" or "index". */
  key: string;
  /** Site-relative href (already base-prefixed), e.g. "/Leetcode/problems/…". */
  url: string;
  title: string;
  description: string;
  /** Coarse content type — drives OG styling + JSON-LD shape. */
  kind: "home" | "section" | "problem" | "pattern" | "guide" | "cheatsheet" | "reference" | "viz";
  /** Section label shown on the OG card (e.g. "Problem", "Guide · Temporal"). */
  eyebrow?: string;
}

const BASE = import.meta.env.BASE_URL;

/**
 * Derive the OG-image route key for a page pathname. Mirrors how getAllPages()
 * builds its keys so the two never drift. "/Leetcode/problems/x/" -> "problems/x".
 */
export function ogKeyForPath(pathname: string): string {
  const base = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  let p = pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length);
  p = p.replace(/\/?index\.html$/, "/").replace(/\.html$/, "");
  p = p.replace(/^\/+|\/+$/g, "");
  return p === "" ? "index" : p;
}

/** Absolute URL on the production origin for a site-relative path. */
export function absoluteUrl(pathOrHref: string): string {
  const path = pathOrHref.startsWith("http")
    ? pathOrHref
    : pathOrHref.startsWith("/")
      ? pathOrHref
      : href(pathOrHref);
  return new URL(path, SITE_URL).toString();
}

/** Absolute URL of the generated OG image for a given route key. */
export function ogImageUrl(key: string): string {
  return absoluteUrl(href(`/open-graph/${key}.png`));
}

/** schema.org BreadcrumbList from an ordered list of {name, path|url}. */
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}

/** schema.org TechArticle/Article for a long-form page. */
export function articleLd(opts: {
  headline: string;
  description: string;
  url: string;
  type?: "Article" | "TechArticle";
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "TechArticle",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    image: opts.image ?? ogImageUrl("index"),
    author: { "@type": "Person", name: "Alan Hsiu" },
    publisher: { "@type": "Person", name: "Alan Hsiu" },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
  };
}

/** schema.org WebSite node for the homepage. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    inLanguage: "en",
    author: { "@type": "Person", name: "Alan Hsiu" },
  };
}

let _pages: PageInfo[] | null = null;

/**
 * Every page on the site, with a title + description + kind. This is the single
 * list the OG-image route, the RSS feed, and structured data all read from.
 */
export async function getAllPages(): Promise<PageInfo[]> {
  if (_pages) return _pages;
  const pages: PageInfo[] = [];

  // ---- static / section pages ----
  pages.push(
    { key: "index", url: href("/"), kind: "home", title: SITE_NAME, description: SITE_DESCRIPTION, eyebrow: "Interview prep" },
    { key: "problems", url: href("/problems"), kind: "section", title: "Problems", description: "Browse every solved problem with difficulty, pattern, and status filters.", eyebrow: "Coding Interview" },
    { key: "neetcode150", url: href("/neetcode150"), kind: "section", title: "NeetCode 150", description: "Structured index of all 150 NeetCode problems by pattern, with links to my notes and the official problems.", eyebrow: "Coding Interview" },
    { key: "patterns", url: href("/patterns"), kind: "section", title: "Patterns", description: "The core data-structure & algorithm patterns, each with a blurb and an interactive visualization.", eyebrow: "Coding Interview" },
    { key: "visualizations", url: href("/visualizations"), kind: "section", title: "Visualizations", description: "Interactive, animated visualizations of the core data-structure & algorithm patterns, with play/pause/step controls.", eyebrow: "Coding Interview" },
    { key: "playground", url: href("/playground"), kind: "section", title: "Playground", description: "Run C++, Python, and JavaScript in your browser — a scratchpad backed by a free public sandbox.", eyebrow: "Coding Interview" },
    { key: "cheatsheets", url: href("/cheatsheets"), kind: "section", title: "Cheat Sheets", description: "Topic cheat sheets across CS, EDA, GPU, and hardware.", eyebrow: "Coding Interview" },
    { key: "reference", url: href("/reference"), kind: "section", title: "C++ Reference", description: "Quick C++ STL reference notes — containers, iterators, and common usage.", eyebrow: "Coding Interview" },
    { key: "cram", url: href("/cram"), kind: "section", title: "Cram Mode", description: "Rapid revision: every solution collapsed to its pattern and complexity, expandable to full code.", eyebrow: "Coding Interview" },
    { key: "dashboard", url: href("/dashboard"), kind: "section", title: "Dashboard", description: "Your study progress across problems and learning guides, stored locally in your browser.", eyebrow: "Coding Interview" },
    { key: "learning", url: href("/learning"), kind: "section", title: "Learning", description: "Hands-on learning tracks beyond coding interviews: Temporal, Mender OTA, and Google Cloud.", eyebrow: "Learning" },
    { key: "404", url: href("/404"), kind: "section", title: "Page not found", description: "That page doesn't exist — head back to the notes.", eyebrow: "404" },
  );

  // ---- problems ----
  for (const p of getProblems()) {
    pages.push({
      key: `problems/${p.routeSlug}`,
      url: href(`/problems/${p.routeSlug}`),
      kind: "problem",
      title: `${p.number}. ${p.title}`,
      description: `C++ solution and notes for LeetCode ${p.number}. ${p.title} — pattern: ${p.patterns.join(", ")}.`,
      eyebrow: `${p.difficulty} · ${p.patterns[0] ?? "Problem"}`,
    });
  }

  // ---- patterns ----
  for (const pat of PATTERNS) {
    pages.push({
      key: `patterns/${pat.slug}`,
      url: href(`/patterns/${pat.slug}`),
      kind: "pattern",
      title: pat.name,
      description: pat.blurb,
      eyebrow: "Pattern",
    });
  }

  // ---- visualizations gallery is a section; individual viz live on pattern pages ----
  void VISUALIZATIONS;

  // ---- cheatsheets ----
  for (const c of getCheatsheets()) {
    pages.push({
      key: `cheatsheets/${c.slug}`,
      url: href(`/cheatsheets/${c.slug}`),
      kind: "cheatsheet",
      title: c.title,
      description: `Cheat sheet: ${c.title} (${c.group}).`,
      eyebrow: `Cheat sheet · ${c.group}`,
    });
  }

  // ---- reference ----
  for (const r of getReference()) {
    pages.push({
      key: `reference/${r.slug}`,
      url: href(`/reference/${r.slug}`),
      kind: "reference",
      title: r.title,
      description: `C++ reference: ${r.title}.`,
      eyebrow: "C++ reference",
    });
  }

  // ---- learning track landings ----
  const views = await getTrackViews();
  for (const v of views) {
    pages.push({
      key: `learning/${v.meta.slug}`,
      url: href(`/learning/${v.meta.slug}`),
      kind: "section",
      title: v.meta.title,
      description: v.meta.blurb || `Guides for ${v.meta.title}.`,
      eyebrow: "Learning track",
    });
  }

  // ---- learning guides ----
  for (const g of await getLearning()) {
    if (isLanding(g)) continue;
    const tslug = trackSlug(g);
    const tTitle = trackMeta(tslug)?.title ?? humanizeTrack(tslug);
    pages.push({
      key: `learning/${tslug}/${guideSlug(g)}`,
      url: href(`/learning/${tslug}/${guideSlug(g)}`),
      kind: "guide",
      title: g.data.title,
      description: g.data.description || `${tTitle} — ${g.data.title}.`,
      eyebrow: `Guide · ${tTitle}`,
    });
  }

  _pages = pages;
  return pages;
}
