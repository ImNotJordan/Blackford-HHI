import { z } from "zod";

/**
 * Shared environment contract for Blackford apps.
 * Demo mode (default) allows missing cloud credentials so UI can run locally.
 * Staging/production require database, Identity Platform, and messaging.
 */

const emptyToUndefined = (value: unknown) =>
  value === "" || value === undefined || value === null ? undefined : value;

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().url().optional(),
);

const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());

const AppEnvSchema = z.enum(["demo", "development", "staging", "production"]);

const SharedEnvSchema = z.object({
  APP_ENV: AppEnvSchema.default("demo"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  /** Staff CRM public URL */
  STAFF_APP_URL: optionalUrl.default("http://localhost:3200"),
  /** Employer portal public URL */
  PORTAL_APP_URL: optionalUrl.default("http://localhost:3300"),

  /** Cloud SQL Postgres connection string */
  DATABASE_URL: optionalString,

  /** Google Cloud Identity Platform / Firebase-compatible web config */
  NEXT_PUBLIC_IDENTITY_API_KEY: optionalString,
  NEXT_PUBLIC_IDENTITY_AUTH_DOMAIN: optionalString,
  NEXT_PUBLIC_IDENTITY_PROJECT_ID: optionalString,
  IDENTITY_PLATFORM_PROJECT_ID: optionalString,

  /** Cloud Storage (census, documents, proof uploads) */
  GCS_BUCKET_DOCUMENTS: optionalString,
  GCS_BUCKET_CENSUS: optionalString,
  GOOGLE_CLOUD_PROJECT: optionalString,

  /** Cloud KMS for SSN field encryption */
  KMS_KEY_NAME: optionalString,

  /** AWS messaging under BAA — SES email + End User Messaging SMS */
  AWS_REGION: optionalString.default("us-east-1"),
  AWS_ACCESS_KEY_ID: optionalString,
  AWS_SECRET_ACCESS_KEY: optionalString,
  SES_FROM_ADDRESS: z.preprocess(
    emptyToUndefined,
    z.string().email().optional(),
  ),
  SMS_ORIGINATION_IDENTITY: optionalString,

  /** Quiet hours for bulk send / automations (local time HH:mm) */
  QUIET_HOURS_START: z.preprocess(emptyToUndefined, z.string().optional()).default("21:00"),
  QUIET_HOURS_END: z.preprocess(emptyToUndefined, z.string().optional()).default("08:00"),
});

export type BlackfordEnv = z.infer<typeof SharedEnvSchema> & {
  isDemo: boolean;
  requiresCloud: boolean;
};

function assertCloudReady(env: z.infer<typeof SharedEnvSchema>) {
  const missing: string[] = [];
  if (!env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!env.NEXT_PUBLIC_IDENTITY_API_KEY && !env.IDENTITY_PLATFORM_PROJECT_ID) {
    missing.push("NEXT_PUBLIC_IDENTITY_API_KEY or IDENTITY_PLATFORM_PROJECT_ID");
  }
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    missing.push("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY");
  }
  if (!env.SES_FROM_ADDRESS) missing.push("SES_FROM_ADDRESS");
  if (missing.length > 0) {
    throw new Error(
      `APP_ENV=${env.APP_ENV} requires cloud credentials. Missing: ${missing.join(", ")}. ` +
        `Set APP_ENV=demo for local UI-only, or fill values from .env.example.`,
    );
  }
}

/**
 * Parse and validate env from an arbitrary record (process.env in Node / Next).
 */
export function loadEnv(
  source: Record<string, string | undefined> = process.env,
): BlackfordEnv {
  const parsed = SharedEnvSchema.safeParse(source);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${detail}`);
  }

  const data = parsed.data;
  const requiresCloud = data.APP_ENV === "staging" || data.APP_ENV === "production";
  const isDemo = data.APP_ENV === "demo" || (!requiresCloud && !data.DATABASE_URL);

  if (requiresCloud) {
    assertCloudReady(data);
  }

  return {
    ...data,
    isDemo,
    requiresCloud,
  };
}

/** True when UI can run without cloud services. */
export function isDemoMode(env: BlackfordEnv = loadEnv()): boolean {
  return env.isDemo;
}

export { SharedEnvSchema, AppEnvSchema };
