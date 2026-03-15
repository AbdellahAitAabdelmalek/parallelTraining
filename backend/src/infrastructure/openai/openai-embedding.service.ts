import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { EmbeddingServicePort } from '../../domain/ports/embedding.service.port';

@Injectable()
export class OpenAIEmbeddingService implements EmbeddingServicePort {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  // text-embedding-3-small: 8192 tokens max
  // French medical text ~3 chars/token → safe limit at 16 000 chars (~5 300 tokens)
  private readonly MAX_CHARS = 16_000;

  async embed(text: string): Promise<number[]> {
    const input = text.length > this.MAX_CHARS ? text.slice(0, this.MAX_CHARS) : text;
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input,
    });
    return response.data[0].embedding;
  }
}