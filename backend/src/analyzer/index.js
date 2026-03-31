import { lintCode } from "./lint.js";
import { analyzeComplexity } from "./complexity.js";
import { analyzeAst } from "./ast.js";
import { calculateScore } from "./score.js";
import { buildRecommendations } from "./recommendations.js";

export async function analyzeCode(code) {
  const { errors, warnings, totalIssues, es6Issues, issues, linter } = lintCode(code);
  const complexity = analyzeComplexity(code);
  const sourceCode = linter.getSourceCode();
  const astAnalysis = analyzeAst(sourceCode, code);

  const scoreResult = calculateScore({
    errors,
    warnings,
    complexity,
    longFunctions: astAnalysis.longFunctions,
    manyParams: astAnalysis.manyParams,
    maxDepth: astAnalysis.maxDepth,
    duplicates: astAnalysis.duplicateLines.length,
    es6Issues,
  });

  const recommendations = buildRecommendations({
    errors,
    warnings,
    complexity,
    longFunctions: astAnalysis.longFunctions,
    manyParams: astAnalysis.manyParams,
    maxDepth: astAnalysis.maxDepth,
    duplicates: astAnalysis.duplicateLines.length,
    es6Issues,
  });

  return {
    score: scoreResult.score,
    status: scoreResult.status,
    metrics: {
      lintErrors: errors,
      lintWarnings: warnings,
      totalIssues,
      complexity,
      maxDepth: astAnalysis.maxDepth,
      totalFunctions: astAnalysis.functions.length,
      longFunctions: astAnalysis.longFunctions.length,
      functionsWithManyParams: astAnalysis.manyParams.length,
      duplicates: astAnalysis.duplicateLines.length,
      es6Issues,
    },
    details: {
      functions: astAnalysis.functions,
      longFunctions: astAnalysis.longFunctions,
      manyParams: astAnalysis.manyParams,
      duplicateLines: astAnalysis.duplicateLines,
      recommendations,
    },
    recommendations,
    issues,
  };
}
