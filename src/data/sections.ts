// Section + group registry for PrepKit.
//
// PrepKit is organized into top-level SECTIONS. Two kinds matter here:
//   - "notes"  sections are powered entirely by the `notes` Content-Layer
//     collection (content/<section>/**). Drop a folder under content/ → a new
//     section appears (with a humanized title fallback if it has no entry below).
//   - "coding" / "reference" sections are specialized (their own routes + data
//     pipeline); they are listed here only so nav and the home page can order and
//     label every section from one place.
//
// GROUPS are optional sub-folders inside a notes section (content/<section>/<group>/…).
// Learning "tracks" (Temporal/Mender/GCP) are just groups. A group with no entry
// here still works via the humanized fallback, so "add a group = drop a folder".

export type SectionKind = "coding" | "notes" | "reference";

export interface SectionMeta {
  slug: string;
  title: string;
  blurb: string;
  icon: string;
  order: number;
  kind: SectionKind;
}

export const SECTIONS: SectionMeta[] = [
  {
    slug: "coding",
    title: "Coding",
    blurb: "DSA problems, NeetCode 150, patterns, visualizations, and an in-browser runner.",
    icon: "</>",
    order: 1,
    kind: "coding",
  },
  {
    slug: "system-design",
    title: "System Design",
    blurb: "Building blocks, frameworks, and worked designs for the system-design interview.",
    icon: "🧩",
    order: 2,
    kind: "notes",
  },
  {
    slug: "behavioral",
    title: "Behavioral",
    blurb: "STAR stories, leadership-principle prep, and answers to the common questions.",
    icon: "💬",
    order: 3,
    kind: "notes",
  },
  {
    slug: "learning",
    title: "Learning",
    blurb: "Concept-first tracks beyond coding interviews — with the same in-page code runner.",
    icon: "📚",
    order: 4,
    kind: "notes",
  },
  {
    slug: "notes",
    title: "Notes",
    blurb: "Low-friction captures — concepts, LeetCode write-ups, and everything else, newest first.",
    icon: "📝",
    order: 5,
    kind: "notes",
  },
  {
    slug: "reference",
    title: "Reference",
    blurb: "Cheat sheets across CS / EDA / GPU / hardware, plus quick C++ STL reference.",
    icon: "📖",
    order: 6,
    kind: "reference",
  },
];

export interface GroupMeta {
  slug: string;
  title: string;
  blurb: string;
  icon: string;
  order: number;
}

// Group metadata for notes sub-folders (currently the Learning tracks).
export const GROUPS: GroupMeta[] = [
  {
    slug: "temporal",
    title: "Temporal",
    blurb: "Durable execution: write workflows that survive crashes, retries, and time.",
    icon: "⏱️",
    order: 1,
  },
  {
    slug: "mender",
    title: "Mender",
    blurb: "Robust over-the-air (OTA) software updates for embedded Linux & IoT fleets.",
    icon: "📦",
    order: 2,
  },
  {
    slug: "gcp",
    title: "Google Cloud",
    blurb: "A working tour of common GCP services: Cloud Run, GKE, Pub/Sub, Storage, IAM, BigQuery.",
    icon: "☁️",
    order: 3,
  },
];

export function sectionMeta(slug: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

export function groupMeta(slug: string): GroupMeta | undefined {
  return GROUPS.find((g) => g.slug === slug);
}

/** Notes-driven sections only (System Design, Behavioral, Learning, …). */
export function notesSections(): SectionMeta[] {
  return SECTIONS.filter((s) => s.kind === "notes").sort((a, b) => a.order - b.order);
}

/** Title-case a folder slug as a fallback for sections/groups without a registry entry. */
export function humanize(slug: string): string {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
