import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { vector } from "./types/vector";

export const cim10Entries = pgTable("chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").notNull().$type<Record<string, unknown>>(),
  embedding: vector("embedding", 1536),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Cim10EntryRow = InferSelectModel<typeof cim10Entries>;
export type NewCim10EntryRow = InferInsertModel<typeof cim10Entries>;
