import type { AnalyzerContext, ScoreResult } from "../types";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default async function scoreStage(context: AnalyzerContext): Promise<AnalyzerContext> {
  const lint = context.lint ?? { errors: 0, warnings: 0, totalIssues: 0, es6Issues: 0, issues: [] };
  const complexity = context.complexity ?? { average: 0, max: 0, functions: [] };
  const duplicates = context.duplication?.duplicates ?? [];
  const functions = context.ast?.functions ?? [];
  
  // Penalties
  const longFunctions = functions.filter((fn) => fn.lines > 20).length;
  const veryLongFunctions = functions.filter((fn) => fn.lines > 50).length;
  const complexFunctions = functions.filter((fn) => fn.complexity > 10).length;
  const deeplyNestedFunctions = functions.filter((fn) => (fn.nesting ?? 0) > 3).length;
  const manyParamsFunctions = functions.filter((fn) => (fn.params ?? 0) > 4).length;
  
  const maxDepth = context.ast?.maxDepth ?? 0;

  // 1. Maintainability: Heavily affected by lint and duplication
  // A single error now costs 25 points, meaning 4 errors = 0% maintainability.
  const lintBasePenalty = lint.errors > 0 ? 15 : 0;
  const maintainability = clamp(100 - (lint.errors * 25 + lint.warnings * 10 + lint.es6Issues * 5 + lintBasePenalty));
  
  // 2. Complexity Score: Focus on cyclomatic complexity and nesting
  // Also penalize complexity score if there are complexity-related lint warnings
  const complexityRuleIssues = lint.issues.filter(i => i.ruleId === "complexity" || i.ruleId === "max-depth").length;
  const complexityScore = clamp(100 - (Math.max(0, complexity.max - 4) * 15 + complexFunctions * 20 + deeplyNestedFunctions * 15 + complexityRuleIssues * 10));
  
  // 3. Duplication Score: Based on total number of redundant blocks found
  const totalDuplicateOccurrences = duplicates.reduce((sum, d) => sum + (d.occurrences - 1), 0);
  const duplicationScore = clamp(100 - totalDuplicateOccurrences * 15);
  
  // 4. Readability: Large functions, too many params, and deep nesting
  const readability = clamp(
    100 - (
      longFunctions * 10 + 
      veryLongFunctions * 25 + 
      manyParamsFunctions * 15 + 
      Math.max(0, maxDepth - 2) * 12 +
      (lint.errors > 0 ? 10 : 0) // Lint errors also hurt readability
    )
  );

  // Overall score: Weighted average
  const overall = clamp(
    maintainability * 0.35 + 
    complexityScore * 0.35 + 
    duplicationScore * 0.10 + 
    readability * 0.20
  );

  const score: ScoreResult = {
    overall,
    maintainability,
    readability,
    complexity: complexityScore,
    duplication: duplicationScore,
  };

  return {
    ...context,
    score,
  };
}
