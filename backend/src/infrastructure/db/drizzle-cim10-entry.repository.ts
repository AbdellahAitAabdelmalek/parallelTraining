import { Inject, Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { Cim10EntryRepositoryPort } from "../../domain/cim10/ports/cim10-entry.repository.port";
import { Cim10Entry } from "../../domain/cim10/entities/cim10-entry.entity";
import { DRIZZLE_DB, DrizzleDb } from "./drizzle.provider";
import { cim10Entries, Cim10EntryRow } from "./schema";

@Injectable()
export class DrizzleCim10EntryRepository implements Cim10EntryRepositoryPort {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async save(cimEntry: Cim10Entry): Promise<void> {
    await this.db.insert(cim10Entries).values({
      id: cimEntry.id,
      content: cimEntry.content,
      metadata: cimEntry.metadata,
      embedding: cimEntry.embedding ?? undefined,
    });
  }

  async truncate(): Promise<void> {
    await this.db.execute(sql`TRUNCATE TABLE cim10_entries`);
  }

  async count(): Promise<number> {
    const result = await this.db.execute<{ count: string }>(
      sql`SELECT COUNT(*)::int as count FROM cim10_entries`,
    );
    return Number(result.rows[0].count);
  }

  async findSimilar(embedding: number[], limit: number): Promise<Cim10Entry[]> {
    const vectorStr = `[${embedding.join(",")}]`;
    const rows = await this.db.execute<Cim10EntryRow>(
      sql`SELECT id, content, metadata, embedding::text, created_at
          FROM cim10_entries
          ORDER BY embedding <=> ${vectorStr}::vector
          LIMIT ${limit}`,
    );
    return rows.rows.map(
      (row) =>
        new Cim10Entry({
          id: row.id,
          content: row.content,
          metadata: row.metadata as Record<string, unknown>,
          embedding: row.embedding
            ? (row.embedding as unknown as string)
                .slice(1, -1)
                .split(",")
                .map(Number)
            : null,
          createdAt: row.createdAt,
        }),
    );
  }
}
