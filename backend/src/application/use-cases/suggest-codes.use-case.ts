import { Injectable } from '@nestjs/common';

@Injectable()
export class SuggestCodesUseCase {
  // TODO: inject ChunkRepositoryPort + EmbeddingServicePort
  // TODO: embed input, find similar chunks, return CIM-10 suggestions
  async execute(input: string): Promise<{ suggestions: unknown[] }> {
    return { suggestions: [] };
  }
}