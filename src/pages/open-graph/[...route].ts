// Build-time OG / social card generator. One 1200×630 PNG per page, rendered with
// canvaskit-wasm (astro-og-canvas) — fully static, no runtime/network at view time.
// Fonts are bundled locally (src/assets/og/*.ttf) so the build is hermetic and works
// offline; the default font URL is never fetched. Images live at /open-graph/<key>.png
// and are wired into each page's <meta og:image>/<twitter:image> via BaseLayout.
import { OGImageRoute } from "astro-og-canvas";
import { getAllPages, SITE_NAME } from "../../lib/seo";

const allPages = await getAllPages();

// astro-og-canvas keys the generated images by the object keys here. We use the
// same route key that BaseLayout computes from the page path, so the two agree.
const pages = Object.fromEntries(
  allPages.map((p) => [p.key, { title: p.title, description: p.description, eyebrow: p.eyebrow }]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    // Show the section label + site name as the supporting line so every card is
    // self-identifying even when reshared without the link text.
    description: page.eyebrow ? `${page.eyebrow}  ·  ${SITE_NAME}` : SITE_NAME,
    bgGradient: [
      [13, 17, 23],
      [17, 24, 39],
    ],
    border: { color: [129, 140, 248], width: 24, side: "inline-start" },
    padding: 70,
    font: {
      title: { color: [237, 237, 235], weight: "Bold", families: ["Inter"], size: 64 },
      description: { color: [148, 163, 184], weight: "Normal", families: ["Inter"], size: 30 },
    },
    fonts: [
      "./src/assets/og/Inter-Regular.ttf",
      "./src/assets/og/Inter-Bold.ttf",
    ],
  }),
});
