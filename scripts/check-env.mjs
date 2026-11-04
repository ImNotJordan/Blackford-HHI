#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const result = spawnSync(
  process.execPath,
  ["--import", "tsx", resolve(root, "scripts/check-env.ts"), ...args],
  { cwd: root, stdio: "inherit", env: process.env },
);
process.exit(result.status ?? 1);
