// RSS 2.0 feed of the site's article-like content: the learning guides plus the
// cheat sheets and C++ reference notes. Problems are excluded (they're an indexed
// catalogue, not a chronological feed). Generated statically at build time.
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPages, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "../lib/seo";
import { href } from "../lib/url";

export async function GET(_context: APIContext) {
  const pages = await getAllPages();
  const feedKinds = new Set(["guide", "cheatsheet", "reference"]);
  const items = pages
    .filter((p) => feedKinds.has(p.kind))
    .map((p) => ({
      title: p.eyebrow ? `${p.eyebrow}: ${p.title}` : p.title,
      description: p.description,
      link: p.url,
    }));

  return rss({
    title: `${SITE_NAME} — guides & notes`,
    description: SITE_DESCRIPTION,
    // Channel link points at the project home (/Leetcode/), not the bare origin.
    site: absoluteUrl(href("/")),
    items,
    customData: "<language>en-us</language>",
  });
}
