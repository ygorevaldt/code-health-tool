import * as espree from "espree";
import type { AnalyzerContext } from "../types";

export default async function parserStage(context: AnalyzerContext): Promise<AnalyzerContext> {
  try {
    // We use espree to get an ESTree-compliant AST which is what astStage expects.
    // It's already in node_modules as a dependency of ESLint.
    const ast = espree.parse(context.code, {
      ecmaVersion: "latest",
      sourceType: "module",
      loc: true,
      range: true,
      tokens: true,
      comment: true,
    });

    return {
      ...context,
      sourceCode: {
        ast,
        text: context.code,
        getText: (node: any) => {
          if (!node) return "";
          if (node.range) return context.code.slice(node.range[0], node.range[1]);
          if (typeof node.start === "number" && typeof node.end === "number") {
            return context.code.slice(node.start, node.end);
          }
          return "";
        },
      } as any,
    };
  } catch (error) {
    console.warn("Parser error (espree):", error);
    // If espree fails (e.g. TypeScript code), we still return the context
    // and downstream stages should handle missing AST gracefully.
    return {
      ...context,
      sourceCode: {
        ast: null,
        text: context.code,
      } as any,
    };
  }
}
