import fs from "fs";
import path from "path";
import { analyzeCode } from "./analyzer";
import { glob } from "glob";

async function run() {
  const args = process.argv.slice(2);
  const target = args[0] || ".";
  const threshold = parseInt(args.find((a) => a.startsWith("--threshold="))?.split("=")[1] || "70", 10);
  const isCi = args.includes("--ci");

  console.log(`\n🔍 Analyzing: ${target}\n`);

  const files = fs.statSync(target).isDirectory()
    ? glob.sync(`${target}/**/*.{js,ts,jsx,tsx}`, { ignore: "node_modules/**" })
    : [target];

  if (files.length === 0) {
    console.log("No files found to analyze.");
    process.exit(0);
  }

  let totalScore = 0;
  let fileCount = 0;

  for (const file of files) {
    try {
      const code = fs.readFileSync(file, "utf-8");
      const result = await analyzeCode(code);
      const score = result.score?.overall || 0;

      totalScore += score;
      fileCount++;

      const color = score >= 90 ? "\x1b[32m" : score >= 70 ? "\x1b[33m" : "\x1b[31m";
      console.log(`${color}[${score.toString().padStart(3)}]${"\x1b[0m"} ${file}`);
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error);
    }
  }

  const averageScore = Math.round(totalScore / fileCount);
  console.log(`\n-----------------------------------------`);
  console.log(`Average Project Score: ${averageScore}/100`);
  console.log(`-----------------------------------------\n`);

  if (isCi && averageScore < threshold) {
    console.error(`❌ CI Check failed: Average score ${averageScore} is below threshold ${threshold}`);
    process.exit(1);
  }

  console.log("✅ Analysis complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
