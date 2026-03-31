import { Linter } from "eslint";
import { getLintConfig } from "./lint-config.js";

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

export function lintCode(code) {
  const linter = new Linter();
  const lintResults = linter.verify(code, getLintConfig());

  const errors = lintResults.filter((m) => m.severity === 2).length;
  const warnings = lintResults.filter((m) => m.severity === 1).length;
  const totalIssues = lintResults.length;
  const es6Issues = lintResults.filter((m) => m.ruleId && es6IssueRules.has(m.ruleId)).length;

  const issues = lintResults.map((m) => ({
    ruleId: m.ruleId || "syntax",
    message: m.message,
    line: m.line || 0,
    column: m.column || 0,
    severity: m.severity,
    severityLabel: m.severity === 2 ? "error" : "warning",
    category: es6IssueRules.has(m.ruleId) ? "ES6" : m.severity === 2 ? "Bug" : "Estilo",
  }));

  return { errors, warnings, totalIssues, es6Issues, issues, linter };
}
