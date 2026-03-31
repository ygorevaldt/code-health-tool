import type { AnalyzerContext } from "./types";
import lintStage from "./stages/lint.stage";
import parserStage from "./stages/parser.stage";
import complexityStage from "./stages/complexity.stage";
import astStage from "./stages/ast.stage";
import duplicationStage from "./stages/duplication.stage";
import scoreStage from "./stages/score.stage";
import recommendationStage from "./stages/recommendation.stage";

type Stage = (context: AnalyzerContext) => Promise<AnalyzerContext>;

const pipeline: Stage[] = [
  parserStage,
  lintStage,
  complexityStage,
  astStage,
  duplicationStage,
  scoreStage,
  recommendationStage,
];

export async function runPipeline(initialContext: AnalyzerContext) {
  let context = initialContext;
  for (const stage of pipeline) {
    context = await stage(context);
  }
  return context;
}
