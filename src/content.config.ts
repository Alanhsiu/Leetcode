// Astro 5 Content Layer: the "learning" collection ingests guide files from the
// (new, non-protected) content/learning/<track>/ folders. Dropping a .md/.mdx
// file into a track folder makes a guide appear with zero wiring; a new folder is
// a new track. The four original content folders are untouched (they use the
// separate import.meta.glob pipeline in src/lib/content.ts).
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const learning = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/learning" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    order: z.number().default(999),
    tags: z.array(z.string()).default([]),
    aiGenerated: z.boolean().default(false),
    // Optional explicit track override; otherwise derived from the folder.
    track: z.string().optional(),
  }),
});

export const collections = { learning };
