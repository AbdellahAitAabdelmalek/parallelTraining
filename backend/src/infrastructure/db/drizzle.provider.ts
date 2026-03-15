import { Provider } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { cim10Entries } from "./schemas/cim10-entry-schema";
import { users } from "./schemas/user-schema";

export const DRIZZLE_DB = Symbol("DRIZZLE_DB");

const schema = {
  cim10Entries,
  users,
};

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE_DB,
  useFactory: () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    return drizzle(pool, { schema });
  },
};
