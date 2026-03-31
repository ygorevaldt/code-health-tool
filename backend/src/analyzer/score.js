export function calculateScore({
  errors,
  warnings,
  complexity,
  longFunctions,
  manyParams,
  maxDepth,
  duplicates,
  es6Issues,
}) {
  let score = 100;

  score -= errors * 8;
  score -= warnings * 3;
  score -= Math.max(0, complexity - 4) * 5;
  score -= longFunctions.length * 7;
  score -= manyParams.length * 5;
  score -= Math.max(0, maxDepth - 3) * 4;
  score -= duplicates * 4;
  score -= es6Issues * 2;

  score = Math.round(Math.max(score, 0));

  let status = "🟢 Muito bom";
  if (score < 90) status = "🟡 Regular";
  if (score < 75) status = "🟠 Ruim";
  if (score < 55) status = "🔴 Crítico";

  return { score, status };
}
