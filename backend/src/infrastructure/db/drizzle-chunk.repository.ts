import { Inject, Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { ChunkRepositoryPort } from "../../domain/ports/chunk.repository.port";
import { Chunk } from "../../domain/entities/chunk.entity";
import { DRIZZLE_DB, DrizzleDb } from "./drizzle.provider";
import { chunks, ChunkRow } from "./schema";

@Injectable()
export class DrizzleChunkRepository implements ChunkRepositoryPort {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async save(chunk: Chunk): Promise<void> {
    await this.db.insert(chunks).values({
      id: chunk.id,
      content: chunk.content,
      metadata: chunk.metadata,
      embedding: chunk.embedding ?? undefined,
    });
  }

  async truncate(): Promise<void> {
    await this.db.execute(sql`TRUNCATE TABLE chunks`);
  }

  async count(): Promise<number> {
    const result = await this.db.execute<{ count: string }>(
      sql`SELECT COUNT(*)::int as count FROM chunks`,
    );
    return Number(result.rows[0].count);
  }

  async findSimilar(embedding: number[], limit: number): Promise<Chunk[]> {
    const vectorStr = `[${embedding.join(",")}]`;
    const rows = await this.db.execute<ChunkRow>(
      sql`SELECT id, content, metadata, embedding::text, created_at
          FROM chunks
          ORDER BY embedding <=> ${vectorStr}::vector
          LIMIT ${limit}`,
    );
    return rows.rows.map(
      (row) =>
        new Chunk(
          row.id,
          row.content,
          row.metadata as Record<string, unknown>,
          row.embedding
            ? (row.embedding as unknown as string)
                .slice(1, -1)
                .split(",")
                .map(Number)
            : null,
          row.createdAt,
        ),
    );
  }
}
