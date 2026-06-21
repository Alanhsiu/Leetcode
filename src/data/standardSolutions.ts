// Standard (canonical, AI-authored) solutions for problems that ALSO have a note of
// mine — keyed by routeSlug. The ~36 NeetCode 150 problems with no note of mine get
// their standard from AI_SOLUTIONS (see aiSolutions.ts) instead, so together every
// problem has a Standard Solution. Sharded like aiSolutions for reviewability.
import type { StandardSolution } from "./standardTypes";
import { S1 } from "./standard/s1";
import { S2 } from "./standard/s2";
import { S3 } from "./standard/s3";
import { S4 } from "./standard/s4";

export type { StandardSolution };
export const STANDARD_SOLUTIONS: StandardSolution[] = [...S1, ...S2, ...S3, ...S4];
