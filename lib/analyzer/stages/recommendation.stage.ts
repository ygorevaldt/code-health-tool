import type { AnalyzerContext, Recommendation } from "../types";

export default async function recommendationStage(context: AnalyzerContext): Promise<AnalyzerContext> {
  const recommendations: Recommendation[] = [];
  const lint = context.lint ?? { errors: 0, warnings: 0, es6Issues: 0, issues: [], totalIssues: 0 };
  const complexity = context.complexity ?? { average: 0, max: 0, functions: [] };
  const duplicates = context.duplication?.duplicates ?? [];
  const functions = context.ast?.functions ?? [];
  const longFunctions = functions.filter((fn) => fn.lines > 30);
  const manyParams = functions.filter((fn) => fn.params > 4);
  const deepNesting = context.ast?.maxDepth ?? 0;

  if (lint.errors > 0) {
    recommendations.push({
      message: "Existem erros de lint bloqueando a qualidade do código.",
      severity: "high",
      suggestion: "Corrija erros de sintaxe e variáveis indefinidas antes de avançar.",
    });
  }

  if (lint.warnings > 0) {
    recommendations.push({
      message: "Avisos de estilo e práticas inseguras foram encontrados.",
      severity: "medium",
      suggestion: "Resolva os avisos para manter o código mais previsível e limpo.",
    });
  }

  if (complexity.max > 10) {
    recommendations.push({
      message: "A complexidade máxima da função está alta.",
      severity: "medium",
      suggestion: "Divida funções longas em unidades menores e com responsabilidade única.",
    });
  }

  if (longFunctions.length > 0) {
    recommendations.push({
      message: `Funções muito longas foram detectadas (${longFunctions.length}).`,
      severity: "medium",
      location: longFunctions[0].name,
      suggestion: "Reescreva trechos extensos em funções menores e mais fáceis de manter.",
    });
  }

  if (manyParams.length > 0) {
    recommendations.push({
      message: `Funções com muitos parâmetros foram detectadas (${manyParams.length}).`,
      severity: "medium",
      location: manyParams[0].name,
      suggestion: "Considere usar objetos de configuração para reduzir a contagem de parâmetros.",
    });
  }

  if (deepNesting > 4) {
    recommendations.push({
      message: "Profundidade de aninhamento alta.",
      severity: "medium",
      suggestion: "Simplifique condicionais e loops para melhorar legibilidade.",
    });
  }

  if (duplicates.length > 0) {
    recommendations.push({
      message: `Código duplicado detectado em ${duplicates.length} blocos.`,
      severity: "high",
      suggestion: "Refatore trechos repetidos em funções reutilizáveis.",
    });
  }

  if (lint.es6Issues > 0) {
    recommendations.push({
      message: "O código ainda pode adotar mais recursos modernos do ES6.",
      severity: "low",
      suggestion: "Use const, template strings e arrow functions onde fizer sentido.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      message: "O código está em bom estado geral.",
      severity: "low",
      suggestion: "Continue mantendo as boas práticas e revisando as funções críticas.",
    });
  }

  return {
    ...context,
    recommendations,
  };
}
