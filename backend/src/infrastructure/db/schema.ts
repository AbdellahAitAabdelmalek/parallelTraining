import { pgTable, uuid, text, jsonb, timestamp, customType } from 'drizzle-orm/pg-core';

// pgvector n'a pas de type natif dans drizzle-orm — on le définit manuellement
const vector = (name: string, dimensions: number) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return `[${value.join(',')}]`;
    },
    fromDriver(value: string): number[] {
      return value
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .map(Number);
    },
  })(name);

export const chunks = pgTable('chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  metadata: jsonb('metadata').notNull().$type<Record<string, unknown>>(),
  embedding: vector('embedding', 1536),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ChunkRow = typeof chunks.$inferSelect;
export type NewChunkRow = typeof chunks.$inferInsert;
