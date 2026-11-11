import { loadEnv, type BlackfordEnv } from "@blackford/core";

let cached: BlackfordEnv | null = null;

/** Server-side env for the staff CRM. Safe to import from Server Components. */
export function getStaffEnv(): BlackfordEnv {
  if (!cached) {
    cached = loadEnv(process.env);
  }
  return cached;
}
