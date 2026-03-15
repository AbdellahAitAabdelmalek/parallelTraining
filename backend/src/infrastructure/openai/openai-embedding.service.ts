import { Injectable } from '@nestjs/common';
import { EmbeddingServicePort } from '../../domain/ports/embedding.service.port';

@Injectable()
export class OpenAIEmbeddingService implements EmbeddingServicePort {
  // TODO: inject OpenAI client, use text-embedding-3-small model
  async embed(_text: string): Promise<number[]> {
    throw new Error('OpenAI embedding not implemented yet');
  }
}