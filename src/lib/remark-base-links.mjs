// Remark plugin: prefix root-absolute Markdown links with the site base, so that
// drop-in notes can link to other pages with a clean, trailing-slash-safe path:
//
//   [STAR method](/behavioral/star-method)  →  /prepkit/behavioral/star-method
//
// External links (http, //, mailto:, #anchors) and links already under the base are
// left untouched. Relative links (no leading slash) are intentionally NOT rewritten —
// the documented convention for cross-note links is the root-absolute form above.
export function remarkBaseLinks({ base = "/" } = {}) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const rewrite = (url) =>
    typeof url === "string" &&
    url.startsWith("/") &&
    !url.startsWith("//") &&
    !(b && url.startsWith(b + "/"));

  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if ((node.type === "link" || node.type === "definition") && rewrite(node.url)) {
      node.url = (b || "") + node.url;
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}
