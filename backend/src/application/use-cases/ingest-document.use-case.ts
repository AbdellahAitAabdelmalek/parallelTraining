import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestDocumentUseCase {
  // TODO: inject ChunkRepositoryPort + EmbeddingServicePort
  // TODO: parse PDF, split into chunks, embed, persist
  async execute(): Promise<{ message: string }> {
    return { message: 'Ingestion not implemented yet' };
  }
}