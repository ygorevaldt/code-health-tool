import { Linter } from "eslint";
import { getLintConfig } from "../lint-config";
import type { AnalyzerContext, Issue } from "../types";

const es6IssueRules = new Set([
  "no-var",
  "prefer-const",
  "prefer-template",
  "prefer-arrow-callback",
  "prefer-rest-params",
  "no-duplicate-imports",
  "arrow-body-style",
  "no-useless-concat",
]);

export default async function lintStage(context: AnalyzerContext): Promise<AnalyzerContext> {
  const linter = new Linter();
  const lintResults = linter.verify(context.code, getLintConfig() as any);

  const issues: Issue[] = lintResults.map((issue) => ({
    ruleId: issue.ruleId || "syntax",
    message: issue.message,
    line: issue.line || 0,
    column: issue.column || 0,
    severity: issue.severity ?? 1,
    severityLabel: issue.severity === 2 ? "error" : "warning",
    category: es6IssueRules.has(issue.ruleId || "") ? "ES6" : issue.severity === 2 ? "Bug" : "Style",
  }));

  return {
    ...context,
    lint: {
      issues,
      errors: issues.filter((issue) => issue.severity === 2).length,
      warnings: issues.filter((issue) => issue.severity === 1).length,
      totalIssues: issues.length,
      es6Issues: issues.filter((issue) => es6IssueRules.has(issue.ruleId)).length,
    },
  };
}
