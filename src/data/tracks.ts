// Learning-track registry: display metadata + ordering for the curated tracks.
// Tracks are discovered from content/learning/<track>/ folders; this registry
// supplies nice titles/blurbs/icons and ordering. A folder with no entry here
// still works — it falls back to a humanized name (see src/lib/learning.ts), so
// "add a track = drop a folder" holds.

export interface TrackMeta {
  slug: string;
  title: string;
  blurb: string;
  icon: string;
  order: number;
}

export const TRACKS: TrackMeta[] = [
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

export function trackMeta(slug: string): TrackMeta | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

/** Title-case a folder slug as a fallback for tracks without a registry entry. */
export function humanizeTrack(slug: string): string {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
