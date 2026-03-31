import { runPipeline } from "./pipeline";
import type { AnalyzerContext } from "./types";

export async function analyzeCode(code: string) {
  const initialContext: AnalyzerContext = { code };
  return runPipeline(initialContext);
}
