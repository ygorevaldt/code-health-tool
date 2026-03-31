#!/usr/bin/env node
const cp = require("node:child_process");
const path = require("node:path");

const cliPath = path.resolve(__dirname, "../lib/cli.ts");
const args = process.argv.slice(2);

// Run with npx tsx to handle TypeScript and imports
const result = cp.spawnSync("npx", ["-y", "tsx", cliPath, ...args], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status || 0);
