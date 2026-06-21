// API over the generalized `notes` content collection. ONE drop-in structure
// powers every markdown section (System Design, Behavioral, Learning, …):
//
//   content/<section>/<note>.md            → a note in a flat section
//   content/<section>/<group>/<note>.md     → a note inside a group (e.g. a track)
//   content/<section>/index.md              → the section landing intro
//   content/<section>/<group>/index.md      → a group landing intro
//
// A note's SECTION is its top-level folder; its GROUP (optional) is the second-level
// folder. URLs mirror the folders: /<section>, /<section>/<group>, /<section>/<note>,
// /<section>/<group>/<note>. Dropping a file adds a page; dropping a folder adds a
// section/group — all with zero wiring.
//
// NOTE: Astro's glob loader collapses index files into their directory id
// (content/x/index.md → id "x"; content/x/y/index.md → id "x/y"). So a flat note
// "x/y" and a group landing "x/y" share the same id shape — we disambiguate by
// looking at the whole set: a second-level segment is a GROUP only if some note is
// actually nested under it (id "x/y/<note>"). Everything is classified from the full
// entry set in classify()/getNoteInfos(); the rest of the app reads NoteInfo.
import { getCollection, type CollectionEntry } from "astro:content";
import {
  sectionMeta, groupMeta, notesSections, humanize,
  type SectionMeta, type GroupMeta,
} from "../data/sections";

export type NoteEntry = CollectionEntry<"notes">;

/** Classification of one entry within the section/group/note model. */
export interface NoteInfo {
  entry: NoteEntry;
  section: string;
  group?: string;
  /** "section" landing, "group" landing, or a "note". */
  kind: "section" | "group" | "note";
  /** URL path within the section: "" (section landing), "<group>", "<note>", "<group>/<note>". */
  path: string;
}

function parts(id: string): string[] {
  return id.split("/").filter(Boolean);
}

/** Stable localStorage progress key for a note (namespaced away from problems). */
export function progressId(idOrInfo: string | NoteInfo): string {
  const id = typeof idOrInfo === "string" ? idOrInfo : idOrInfo.entry.id;
  return `note/${id}`;
}

/** Set of group slugs per section — a 2nd-level folder that actually contains notes. */
function groupsBySection(all: NoteEntry[]): Map<string, Set<string>> {
  const m = new Map<string, Set<string>>();
  for (const e of all) {
    const p = parts(e.id);
    if (p.length >= 3) {
      if (!m.has(p[0])) m.set(p[0], new Set());
      m.get(p[0])!.add(p[1]);
    }
  }
  return m;
}

function classify(e: NoteEntry, groups: Map<string, Set<string>>): NoteInfo {
  const p = parts(e.id);
  const section = p[0];
  const gset = groups.get(section);
  if (p.length === 1) return { entry: e, section, kind: "section", path: "" };
  if (p.length === 2) {
    if (gset?.has(p[1])) return { entry: e, section, group: p[1], kind: "group", path: p[1] };
    return { entry: e, section, kind: "note", path: p[1] };
  }
  return { entry: e, section, group: p[1], kind: "note", path: p.slice(1).join("/") };
}

export async function getNotes(): Promise<NoteEntry[]> {
  return await getCollection("notes");
}

let _infos: NoteInfo[] | null = null;
export async function getNoteInfos(): Promise<NoteInfo[]> {
  if (_infos) return _infos;
  const all = await getNotes();
  const groups = groupsBySection(all);
  _infos = all.map((e) => classify(e, groups));
  return _infos;
}

export async function noteInfoById(id: string): Promise<NoteInfo | undefined> {
  return (await getNoteInfos()).find((n) => n.entry.id === id);
}

export interface GroupView {
  meta: GroupMeta;
  landing?: NoteInfo;
  notes: NoteInfo[];
}

export interface SectionView {
  meta: SectionMeta;
  landing?: NoteInfo;
  /** Notes directly under the section (no group). */
  notes: NoteInfo[];
  /** Grouped notes (e.g. learning tracks). */
  groups: GroupView[];
  aiGenerated: boolean;
}

function sectionMetaFor(slug: string, fallbackOrder: number): SectionMeta {
  return (
    sectionMeta(slug) ?? {
      slug, title: humanize(slug), blurb: "", icon: "📘", order: 100 + fallbackOrder, kind: "notes",
    }
  );
}

function groupMetaFor(slug: string, fallbackOrder: number): GroupMeta {
  return groupMeta(slug) ?? { slug, title: humanize(slug), blurb: "", icon: "📁", order: 100 + fallbackOrder };
}

const byOrder = (a: NoteInfo, b: NoteInfo) =>
  a.entry.data.order - b.entry.data.order || a.entry.data.title.localeCompare(b.entry.data.title);

function buildSectionView(slug: string, infos: NoteInfo[], fallbackOrder: number): SectionView {
  const landing = infos.find((n) => n.kind === "section");
  const notes = infos.filter((n) => n.kind === "note" && !n.group).sort(byOrder);

  const groupMap = new Map<string, NoteInfo[]>();
  for (const n of infos) {
    if (n.group) {
      if (!groupMap.has(n.group)) groupMap.set(n.group, []);
      groupMap.get(n.group)!.push(n);
    }
  }
  let gi = 0;
  const groups: GroupView[] = [...groupMap.entries()]
    .map(([g, ns]) => ({
      meta: groupMetaFor(g, gi++),
      landing: ns.find((n) => n.kind === "group"),
      notes: ns.filter((n) => n.kind === "note").sort(byOrder),
    }))
    .sort((a, b) => a.meta.order - b.meta.order);

  return {
    meta: sectionMetaFor(slug, fallbackOrder),
    landing,
    notes,
    groups,
    aiGenerated: infos.some((n) => n.entry.data.aiGenerated),
  };
}

export async function getSectionViews(): Promise<SectionView[]> {
  const infos = await getNoteInfos();
  const bySection = new Map<string, NoteInfo[]>();
  for (const n of infos) {
    if (!bySection.has(n.section)) bySection.set(n.section, []);
    bySection.get(n.section)!.push(n);
  }
  const order = (slug: string) => sectionMeta(slug)?.order ?? 999;
  let i = 0;
  return [...bySection.entries()]
    .map(([slug, ns]) => buildSectionView(slug, ns, i++))
    .sort((a, b) => order(a.meta.slug) - order(b.meta.slug) || a.meta.title.localeCompare(b.meta.title));
}

export async function getSectionView(slug: string): Promise<SectionView | undefined> {
  return (await getSectionViews()).find((v) => v.meta.slug === slug);
}

/** Flat, ordered list of a section's notes (groups expanded in group order) — for prev/next. */
export function orderedNotes(view: SectionView): NoteInfo[] {
  return [...view.notes, ...view.groups.flatMap((g) => g.notes)];
}

export { notesSections };
