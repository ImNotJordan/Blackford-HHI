import { loadEnv, isDemoMode } from "@blackford/core";
import { getDbConfig } from "@blackford/db";

/**
 * Automation job names (Graphile Worker task identifiers).
 * Runtime wiring (Graphile Worker, Puppeteer, pdf-lib, LiquidJS) comes later.
 */
export const JOB_SEND_INVITES_AND_REMINDERS =
  "automation/send_invites_and_reminders";
export const JOB_CHANNEL_FALLBACK = "automation/channel_fallback";
export const JOB_NIGHTLY_CHECKS = "automation/nightly_checks";
export const JOB_LIFE_EVENT_WINDOWS = "automation/life_event_windows";
export const JOB_CARRIER_FILES = "automation/carrier_files";
export const JOB_AUDIT_INTEGRITY_CHECK = "automation/audit_integrity_check";

export const AUTOMATION_JOBS = [
  JOB_SEND_INVITES_AND_REMINDERS,
  JOB_CHANNEL_FALLBACK,
  JOB_NIGHTLY_CHECKS,
  JOB_LIFE_EVENT_WINDOWS,
  JOB_CARRIER_FILES,
  JOB_AUDIT_INTEGRITY_CHECK,
] as const;

export type AutomationJobName = (typeof AUTOMATION_JOBS)[number];

const env = loadEnv(process.env);
const db = getDbConfig(env);

console.log(
  `[@blackford/worker] APP_ENV=${env.APP_ENV} demo=${isDemoMode(env)} database=${Boolean(db)} quiet=${env.QUIET_HOURS_START}-${env.QUIET_HOURS_END}`,
);
console.log("[@blackford/worker] Registered job stubs:", AUTOMATION_JOBS.join(", "));
