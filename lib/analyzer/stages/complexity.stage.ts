import escomplex from "typhonjs-escomplex";
import type { AnalyzerContext, FunctionMetric } from "../types";

export default async function complexityStage(context: AnalyzerContext): Promise<AnalyzerContext> {
  try {
    const report: any = escomplex.analyzeModule(context.code);
    const functions: FunctionMetric[] = (report.functions || []).map((fn: any) => ({
      name: fn.name || "anonymous",
      line: fn.lineStart || fn.line || 0,
      lines: (fn.lineEnd || fn.line || 0) - (fn.lineStart || fn.line || 0) + 1,
      complexity: fn.cyclomatic || 0,
      params: fn.params || 0,
      nesting: fn.maxNestDepth || 0,
    }));

    const average = functions.length
      ? Math.round(functions.reduce((sum, item) => sum + item.complexity, 0) / functions.length)
      : 0;
    const max = functions.reduce((maxValue, item) => Math.max(maxValue, item.complexity), 0);

    return {
      ...context,
      complexity: {
        average,
        max,
        functions,
      },
    };
  } catch (error) {
    return {
      ...context,
      complexity: {
        average: 0,
        max: 0,
        functions: [],
      },
    };
  }
}
