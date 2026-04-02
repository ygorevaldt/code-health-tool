import type { SourceCode } from "eslint";

export type Severity = "low" | "medium" | "high";

export type ProjectType = "javascript" | "react" | "vue" | "angular" | "angularjs" | "node" | "typescript";

export type Issue = {
  ruleId: string;
  message: string;
  line: number;
  column: number;
  severity: number;
  severityLabel: "error" | "warning";
  category: string;
};

export type FunctionMetric = {
  name: string;
  line: number;
  lines: number;
  complexity: number;
  params: number;
  nesting: number;
};

export type DuplicateBlock = {
  snippet: string;
  occurrences: number;
  locations: string[];
};

export type ScoreResult = {
  overall: number;
  maintainability: number;
  readability: number;
  complexity: number;
  duplication: number;
};

export type Recommendation = {
  message: string;
  severity: Severity;
  location?: string;
  suggestion: string;
};

export type AnalyzerContext = {
  code: string;
  type?: ProjectType;
  sourceCode?: SourceCode;
  lint?: {
    issues: Issue[];
    errors: number;
    warnings: number;
    totalIssues: number;
    es6Issues: number;
  };
  complexity?: {
    average: number;
    max: number;
    functions: FunctionMetric[];
  };
  ast?: {
    functions: FunctionMetric[];
    maxDepth: number;
  };
  duplication?: {
    duplicates: DuplicateBlock[];
  };
  score?: ScoreResult;
  recommendations?: Recommendation[];
};
