import { loadEnv, type BlackfordEnv } from "@blackford/core";

let cached: BlackfordEnv | null = null;

/** Server-side env for the employer portal. Safe to import from Server Components. */
export function getPortalEnv(): BlackfordEnv {
  if (!cached) {
    cached = loadEnv(process.env);
  }
  return cached;
}
