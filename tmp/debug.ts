import { analyzeCode } from "../lib/analyzer";

const code = `
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    if (item.active) {
      total += item.value;
    }
  }
  return total;
}
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    if (item.active) {
      total += item.value;
    }
  }
  return total;
}

const teste = 11
const teste = 12
teste = 12
`;

async function debug() {
  const result = await analyzeCode(code);
  console.log("--- RESULTS ---");
  console.log("Lint Errors:", result.lint.errors);
  console.log("Duplication Count:", result.duplication.duplicates.length);
  console.log("Score:", JSON.stringify(result.score, null, 2));
  console.log("Functions:", result.ast.functions.length);
}

debug().catch(console.error);
