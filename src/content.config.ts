// Astro 5 Content Layer: the generalized `notes` collection powers every markdown
// section (System Design, Behavioral, Learning, …) from one drop-in structure:
//
//   content/<section>/<note>.md             → a note in a flat section
//   content/<section>/<group>/<note>.md      → a note inside a group (e.g. a track)
//   content/<section>/index.md               → the section landing intro
//   content/<section>/<group>/index.md       → a group landing intro
//
// Dropping a .md/.mdx file makes a page appear; dropping a folder makes a new
// section (or group) — all with zero wiring (see src/lib/notes.ts). The coding
// problems + reference/cheat sheets use the separate raw-glob pipeline in
// src/lib/content.ts (relocated under coding/ and reference/).
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    order: z.number().default(999),
    tags: z.array(z.string()).default([]),
    aiGenerated: z.boolean().default(false),

    // ---- Note-capture metadata (task: low-friction capture + timeline) ----
    // What kind of note this is — drives badges on the section index + /timeline.
    type: z.enum(["concept", "leetcode", "other"]).default("concept"),
    // Full ISO timestamps. BOTH are optional: when omitted (a note added by hand
    // or via the GitHub web editor on mobile), they are DERIVED at build from the
    // file's git history — see src/lib/dates.ts. So nothing is ever unsorted.
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    // LeetCode-specific (only meaningful when type === "leetcode").
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    leetcodeUrl: z.string().url().optional(),
    problemNumber: z.number().optional(),
  }),
});

export const collections = { notes };
