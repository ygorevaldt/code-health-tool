import escomplex from "typhonjs-escomplex";

export function analyzeComplexity(code) {
  try {
    const report = escomplex.analyzeModule(code);
    return report.aggregate?.cyclomatic || 0;
  } catch (error) {
    console.warn("Complexity analysis failed:", error);
    return 0;
  }
}
