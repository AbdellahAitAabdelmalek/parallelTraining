import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  customType,
} from "drizzle-orm/pg-core";

const vector = (name: string, dimensions: number) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string): number[] {
      return value.slice(1, -1).split(",").map(Number);
    },
  })(name);

export const cim10Entries = pgTable("chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").notNull().$type<Record<string, unknown>>(),
  embedding: vector("embedding", 1536),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Cim10EntryRow = typeof cim10Entries.$inferSelect;
export type NewCim10EntryRow = typeof cim10Entries.$inferInsert;
