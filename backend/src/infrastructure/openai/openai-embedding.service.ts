import { Inject, Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { EmbeddingServicePort } from "../../domain/ports/embedding.service.port";
import { OPENAI_CLIENT } from "./openai.provider";

@Injectable()
export class OpenAIEmbeddingService implements EmbeddingServicePort {
  constructor(
    @Inject(OPENAI_CLIENT) private readonly client: OpenAI,
  ) {}

  // text-embedding-3-small: 8192 tokens max
  // French medical text ~3 chars/token → safe limit at 16 000 chars (~5 300 tokens)
  private readonly MAX_CHARS = 16_000;

  async embed(text: string): Promise<number[]> {
    const input =
      text.length > this.MAX_CHARS ? text.slice(0, this.MAX_CHARS) : text;
    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });
    return response.data[0].embedding;
  }
}
