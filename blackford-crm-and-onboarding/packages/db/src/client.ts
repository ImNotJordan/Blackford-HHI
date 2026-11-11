export type DbConnectionConfig = {
  connectionString: string;
};

type DbEnv = {
  DATABASE_URL?: string;
  APP_ENV: string;
};

/**
 * Resolve DB config from env. Returns null when DATABASE_URL is unset (demo).
 * When leaving demo, install `pg` in the app and create Drizzle with:
 *
 *   import { drizzle } from "drizzle-orm/node-postgres";
 *   import { Pool } from "pg";
 *   import * as schema from "@blackford/db";
 *   const pool = new Pool({ connectionString: config.connectionString });
 *   export const db = drizzle(pool, { schema });
 */
export function getDbConfig(env: DbEnv): DbConnectionConfig | null {
  if (!env.DATABASE_URL) {
    if (env.APP_ENV === "staging" || env.APP_ENV === "production") {
      throw new Error(
        "DATABASE_URL is required when APP_ENV is staging or production",
      );
    }
    return null;
  }

  return { connectionString: env.DATABASE_URL };
}
