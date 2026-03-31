import type { AnalyzerContext, FunctionMetric } from "../types";

const nestingNodes = new Set([
  "IfStatement",
  "ForStatement",
  "ForInStatement",
  "ForOfStatement",
  "WhileStatement",
  "DoWhileStatement",
  "SwitchStatement",
  "ConditionalExpression",
]);

function calculateNesting(node: any, current = 0): number {
  let maxDepth = current;
  if (!node || typeof node !== "object") return maxDepth;

  if (nestingNodes.has(node.type)) {
    current += 1;
    maxDepth = Math.max(maxDepth, current);
  }

  for (const key of Object.keys(node)) {
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        maxDepth = Math.max(maxDepth, calculateNesting(item, current));
      }
    } else if (child && typeof child === "object") {
      maxDepth = Math.max(maxDepth, calculateNesting(child, current));
    }
  }

  return maxDepth;
}

function isFunction(node: any) {
  return ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(node?.type);
}

function getFunctionName(node: any) {
  if (node.id?.name) return node.id.name;
  return "anonymous";
}

function walkAst(node: any, callback: (node: any) => void) {
  if (!node || typeof node !== "object") return;
  callback(node);
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        walkAst(item, callback);
      }
    } else if (child && typeof child === "object") {
      walkAst(child, callback);
    }
  }
}

export default async function astStage(context: AnalyzerContext): Promise<AnalyzerContext> {
  const ast = context.sourceCode?.ast;
  if (!ast) {
    return {
      ...context,
      ast: {
        functions: [],
        maxDepth: 0,
      },
    };
  }

  const functions: FunctionMetric[] = [];
  let maxDepth = 0;

  walkAst(ast, (node) => {
    if (isFunction(node) && node.loc) {
      const lines = node.loc.end.line - node.loc.start.line + 1;
      const nesting = calculateNesting(node.body || node, 0);
      functions.push({
        name: getFunctionName(node),
        line: node.loc.start.line,
        lines,
        complexity: 0,
        params: node.params?.length || 0,
        nesting,
      });
      maxDepth = Math.max(maxDepth, nesting);
    }
  });

  const mergedFunctions = functions.map((fn) => {
    const match = context.complexity?.functions.find((item) => item.line === fn.line && item.name === fn.name);
    return {
      ...fn,
      complexity: match?.complexity ?? fn.complexity,
      params: match?.params ?? fn.params,
    };
  });

  return {
    ...context,
    ast: {
      functions: mergedFunctions,
      maxDepth,
    },
  };
}
