import { Inject, Injectable } from '@nestjs/common';
import { ChunkRepositoryPort } from '../../domain/ports/chunk.repository.port';
import { Chunk } from '../../domain/entities/chunk.entity';
import { DRIZZLE_DB, DrizzleDb } from './drizzle.provider';
import { chunks } from './schema';

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

  async findSimilar(_embedding: number[], _limit: number): Promise<Chunk[]> {
    // TODO: implement cosine similarity search with pgvector operator <=>
    return [];
  }
}