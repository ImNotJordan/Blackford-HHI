/**
 * Validate env for staff / portal / worker.
 *   npx tsx scripts/check-env.ts
 *   npx tsx scripts/check-env.ts staff
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../packages/core/src/env.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const targets: Record<string, string> = {
  staff: "apps/staff",
  portal: "apps/portal",
  worker: "apps/worker",
};

function loadDotEnv(filePath: string, into: Record<string, string | undefined>) {
  if (!existsSync(filePath)) return false;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (into[key] === undefined) into[key] = value;
  }
  return true;
}

function check(name: string) {
  const rel = targets[name];
  if (!rel) throw new Error(`Unknown target: ${name}`);
  const dir = resolve(root, rel);
  const env: Record<string, string | undefined> = { ...process.env };
  const loaded: string[] = [];
  if (loadDotEnv(resolve(dir, ".env.local"), env)) loaded.push(".env.local");
  if (loadDotEnv(resolve(dir, ".env"), env)) loaded.push(".env");
  if (loadDotEnv(resolve(root, ".env"), env)) loaded.push("root .env");

  const parsed = loadEnv(env);
  console.log(
    `[${name}] OK  APP_ENV=${parsed.APP_ENV}  demo=${parsed.isDemo}  database=${Boolean(parsed.DATABASE_URL)}  files=${loaded.join(", ") || "(process.env only)"}`,
  );
}

const arg = process.argv[2] ?? "all";
const list = arg === "all" ? Object.keys(targets) : [arg];
for (const name of list) {
  try {
    check(name);
  } catch (err) {
    console.error(`[${name}] FAIL`, err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}
