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
  const config = getLintConfig(context.type);

  // --- Dynamic Plugin & Parser Registration ---
  try {
    if (context.type === "react") {
      const reactPlugin = require("eslint-plugin-react");
      const reactHooksPlugin = require("eslint-plugin-react-hooks");
      linter.defineRules(Object.fromEntries(
        Object.entries(reactPlugin.rules || {}).map(([name, rule]: [string, any]) => [`react/${name}`, rule])
      ));
      linter.defineRules(Object.fromEntries(
        Object.entries(reactHooksPlugin.rules || {}).map(([name, rule]: [string, any]) => [`react-hooks/${name}`, rule])
      ));
    }

    if (context.type === "vue") {
      const vuePlugin = require("eslint-plugin-vue");
      linter.defineRules(Object.fromEntries(
        Object.entries(vuePlugin.rules || {}).map(([name, rule]: [string, any]) => [`vue/${name}`, rule])
      ));
      linter.defineParser("vue-eslint-parser", require("vue-eslint-parser"));
    }

    if (context.type === "angular") {
      const angularPlugin = require("@angular-eslint/eslint-plugin");
      linter.defineRules(Object.fromEntries(
        Object.entries(angularPlugin.rules || {}).map(([name, rule]: [string, any]) => [`@angular-eslint/${name}`, rule])
      ));
    }

    if (context.type === "angularjs") {
      const angularJSPlugin = require("eslint-plugin-angular");
      linter.defineRules(Object.fromEntries(
        Object.entries(angularJSPlugin.rules || {}).map(([name, rule]: [string, any]) => [`angular/${name}`, rule])
      ));
    }

    if (context.type === "typescript" || context.type === "angular" || context.type === "react") {
      const tsParser = require("@typescript-eslint/parser");
      const tsPlugin = require("@typescript-eslint/eslint-plugin");
      linter.defineParser("@typescript-eslint/parser", tsParser);
      linter.defineRules(Object.fromEntries(
        Object.entries(tsPlugin.rules || {}).map(([name, rule]: [string, any]) => [`@typescript-eslint/${name}`, rule])
      ));
    }
  } catch (err) {
    console.error("Error loading ESLint plugins:", err);
  }

  const lintResults = linter.verify(context.code, config as any);

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
