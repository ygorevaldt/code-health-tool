import { runPipeline } from "./pipeline";
import type { AnalyzerContext, ProjectType } from "./types";

export async function analyzeCode(code: string, type: ProjectType = "javascript") {
  const initialContext: AnalyzerContext = { code, type };
  return runPipeline(initialContext);
}
