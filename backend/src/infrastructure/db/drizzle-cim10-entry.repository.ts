import { Inject, Injectable } from "@nestjs/common";
import { count, sql } from "drizzle-orm";
import { Cim10EntryRepositoryPort } from "../../features/cim10/ports/cim10-entry.repository.port";
import { Cim10Entry } from "../../features/cim10/entities/cim10-entry.entity";
import { DRIZZLE_DB, DrizzleDb } from "./drizzle.provider";
import { cim10Entries } from "./schemas/cim10-entry-schema";

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
    await this.db.delete(cim10Entries);
  }

  async count(): Promise<number> {
    const result = await this.db.select({ count: count() }).from(cim10Entries);
    return result[0].count;
  }

  async findSimilar(embedding: number[], limit: number): Promise<Cim10Entry[]> {
    const vectorStr = `[${embedding.join(",")}]`;
    const rows = await this.db
      .select()
      .from(cim10Entries)
      .orderBy(sql`embedding <=> ${vectorStr}::vector`)
      .limit(limit);

    return rows.map(
      (row) =>
        new Cim10Entry({
          id: row.id,
          content: row.content,
          metadata: row.metadata as Record<string, unknown>,
          embedding: row.embedding,
          createdAt: row.createdAt,
        }),
    );
  }
}