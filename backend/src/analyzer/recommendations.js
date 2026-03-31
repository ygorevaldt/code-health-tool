export function buildRecommendations({
  errors,
  warnings,
  complexity,
  longFunctions,
  manyParams,
  maxDepth,
  duplicates,
  es6Issues,
}) {
  const recommendations = [];

  if (errors > 0) recommendations.push("Corrija os erros de lint antes de mais nada.");
  if (warnings > 0) recommendations.push("Evite avisos de estilo e práticas inseguras.");
  if (complexity > 10)
    recommendations.push("Reduza a complexidade ciclomática simplificando lógica e extraindo funções.");
  if (longFunctions.length) recommendations.push("Divida funções muito longas em várias menores.");
  if (manyParams.length) recommendations.push("Reduza o número de parâmetros em funções para facilitar a manutenção.");
  if (maxDepth > 4) recommendations.push("Evite condicionais e loops profundamente aninhados.");
  if (duplicates) recommendations.push("Remova trechos duplicados de código.");
  if (es6Issues > 0) recommendations.push("Aplique padrões ES6 como const, template strings e arrow functions.");
  if (recommendations.length === 0)
    recommendations.push("O código está saudável, mas continue revisando estilo e complexidade.");

  return recommendations;
}
