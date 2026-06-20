import type { AiSolution } from "./aiTypes";
import { A } from "./aiSolutionsA";
import { B } from "./aiSolutionsB";
import { C } from "./aiSolutionsC";
import { D } from "./aiSolutionsD";

export type { AiSolution };
export const AI_SOLUTIONS: AiSolution[] = [...A, ...B, ...C, ...D];
