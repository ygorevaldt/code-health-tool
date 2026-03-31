export function analyzeAst(sourceCode, code) {
  const functions = [];
  let maxDepth = 0;
  const duplicateMap = {};
  const visited = new WeakSet();

  function analyzeNode(node, depth = 0) {
    if (!node || typeof node !== "object") return;
    if (visited.has(node)) return;
    visited.add(node);

    if (node.parent) delete node.parent;

    if (
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression"
    ) {
      const lines = node.loc.end.line - node.loc.start.line + 1;
      const params = node.params.length;
      const startLine = node.loc.start.line;

      functions.push({
        name: node.id?.name || "anonymous",
        line: startLine,
        lines,
        params,
      });
    }

    if (
      node.type === "IfStatement" ||
      node.type === "ForStatement" ||
      node.type === "WhileStatement" ||
      node.type === "ForOfStatement"
    ) {
      depth++;
      maxDepth = Math.max(maxDepth, depth);
    }

    if (node.loc) {
      const line = code.split("\n")[node.loc.start.line - 1]?.trim();
      if (line && line.length > 10) {
        duplicateMap[line] = (duplicateMap[line] || 0) + 1;
      }
    }

    for (const key in node) {
      if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
      const child = node[key];
      if (child && typeof child === "object") {
        if (Array.isArray(child)) {
          child.forEach((item) => analyzeNode(item, depth));
        } else {
          analyzeNode(child, depth);
        }
      }
    }
  }

  if (!sourceCode || !sourceCode.ast) {
    return {
      functions: [],
      maxDepth: 0,
      duplicateLines: [],
      longFunctions: [],
      manyParams: [],
    };
  }

  analyzeNode(sourceCode.ast);

  const longFunctions = functions.filter((func) => func.lines > 30);
  const manyParams = functions.filter((func) => func.params > 3);
  const duplicateLines = Object.entries(duplicateMap)
    .filter(([_, count]) => count > 2)
    .map(([line]) => line);

  return {
    functions,
    maxDepth,
    duplicateLines,
    longFunctions,
    manyParams,
  };
}
