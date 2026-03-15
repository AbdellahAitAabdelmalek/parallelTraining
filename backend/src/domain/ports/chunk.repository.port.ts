import { Chunk } from '../entities/chunk.entity';

export const CHUNK_REPOSITORY = Symbol('CHUNK_REPOSITORY');

export interface ChunkRepositoryPort {
  save(chunk: Chunk): Promise<void>;
  findSimilar(embedding: number[], limit: number): Promise<Chunk[]>;
}