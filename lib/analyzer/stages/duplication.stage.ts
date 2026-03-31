import type { AnalyzerContext, DuplicateBlock } from "../types";

function normalizeNode(node: any): any {
  if (node === null || typeof node !== "object") return null;
  if (Array.isArray(node)) return node.map(normalizeNode);

  // Preserve the actual type of the node for structural matching!
  const normalized: any = { type: node.type };
  
  for (const key of Object.keys(node)) {
    // Skip boilerplate properties
    if (["loc", "range", "start", "end", "type", "parent"].includes(key)) continue;
    
    const value = node[key];
    if (value === null || typeof value === "undefined") continue;

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      // Generalize names and literal values to find similar code patterns
      normalized[key] = ["Identifier", "Literal"].includes(node.type) ? node.type : typeof value;
      continue;
    }

    if (Array.isArray(value)) {
      normalized[key] = value.map(normalizeNode);
      continue;
    }

    if (typeof value === "object") {
      normalized[key] = normalizeNode(value);
    }
  }

  return normalized;
}

export default async function duplicationStage(context: AnalyzerContext): Promise<AnalyzerContext> {
  const ast = context.sourceCode?.ast;
  if (!ast) {
    return {
      ...context,
      duplication: { duplicates: [] },
    };
  }

  const blocks = new Map<string, { locations: string[]; snippet: string; count: number }>();

  const walkAst = (node: any) => {
    if (!node || typeof node !== "object") return;

    // Threshold reduced to 2+ statements to be more assertive
    if (node.type === "BlockStatement" && node.body?.length >= 2) {
      const normalized = normalizeNode(node);
      const key = JSON.stringify(normalized);
      const snippet = context.sourceCode?.getText(node).trim() || "";
      const location = node.loc ? `linha ${node.loc.start.line}` : "desconhecido";
      const existing = blocks.get(key);
      
      if (existing) {
        existing.count += 1;
        existing.locations.push(location);
      } else {
        blocks.set(key, { locations: [location], snippet, count: 1 });
      }
    }

    // Walk all children recursively
    for (const childKey of Object.keys(node)) {
      if (childKey === "parent" || childKey === "loc" || childKey === "range") continue;
      const child = node[childKey];
      if (Array.isArray(child)) {
        child.forEach(walkAst);
      } else if (child && typeof child === "object") {
        walkAst(child);
      }
    }
  };

  walkAst(ast);

  const duplicates: DuplicateBlock[] = Array.from(blocks.values())
    .filter((entry) => entry.count > 1)
    .map((entry) => ({
      snippet: entry.snippet,
      occurrences: entry.count,
      locations: entry.locations,
    }));

  return {
    ...context,
    duplication: { duplicates },
  };
}
