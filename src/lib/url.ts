// Always route internal links through the configured base path so the site
// works both locally and under https://alanhsiu.github.io/prepkit/.
const BASE = import.meta.env.BASE_URL; // e.g. "/prepkit/" or "/prepkit"

/** Join the site base with a path, collapsing duplicate slashes. */
export function href(path = "/"): string {
  const base = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`.replace(/([^:])\/\/+/g, "$1/");
}

/** Build a URL-safe slug from arbitrary text. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
