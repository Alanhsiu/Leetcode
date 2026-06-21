// API over the "learning" content collection: groups guides into tracks, derives
// track metadata, and exposes lookups for the routes. A guide's track is its
// folder (or an explicit `track:` in frontmatter); a `<track>/index.md(x)` file
// is treated as that track's landing intro.
import { getCollection, type CollectionEntry } from "astro:content";
import { trackMeta, humanizeTrack, type TrackMeta } from "../data/tracks";

export type GuideEntry = CollectionEntry<"learning">;

function idParts(entry: GuideEntry): string[] {
  return entry.id.split("/").filter(Boolean);
}

export function trackSlug(entry: GuideEntry): string {
  return entry.data.track ?? idParts(entry)[0];
}

/** Path within the track, e.g. "durable-execution" or "index". */
export function guideSlug(entry: GuideEntry): string {
  return idParts(entry).slice(1).join("/");
}

export function isLanding(entry: GuideEntry): boolean {
  const g = guideSlug(entry);
  return g === "" || g === "index";
}

/** Stable localStorage progress key for a guide (namespaced away from problems). */
export function guideProgressId(entry: GuideEntry): string {
  return `guide/${entry.id}`;
}

export interface TrackView {
  meta: TrackMeta;
  landing?: GuideEntry;
  guides: GuideEntry[];
  aiGenerated: boolean; // any guide in the track is AI-authored
}

export async function getLearning(): Promise<GuideEntry[]> {
  return await getCollection("learning");
}

function metaFor(slug: string, fallbackOrder: number): TrackMeta {
  return trackMeta(slug) ?? { slug, title: humanizeTrack(slug), blurb: "", icon: "📘", order: 100 + fallbackOrder };
}

export async function getTrackViews(): Promise<TrackView[]> {
  const all = await getLearning();
  const bySlug = new Map<string, GuideEntry[]>();
  for (const e of all) {
    const s = trackSlug(e);
    if (!bySlug.has(s)) bySlug.set(s, []);
    bySlug.get(s)!.push(e);
  }
  const views: TrackView[] = [];
  let i = 0;
  for (const [slug, entries] of bySlug) {
    const guides = entries
      .filter((e) => !isLanding(e))
      .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
    views.push({
      meta: metaFor(slug, i++),
      landing: entries.find(isLanding),
      guides,
      aiGenerated: entries.some((e) => e.data.aiGenerated),
    });
  }
  return views.sort((a, b) => a.meta.order - b.meta.order);
}

export async function getTrackView(slug: string): Promise<TrackView | undefined> {
  return (await getTrackViews()).find((v) => v.meta.slug === slug);
}

export async function getGuideById(id: string): Promise<GuideEntry | undefined> {
  return (await getLearning()).find((e) => e.id === id);
}
