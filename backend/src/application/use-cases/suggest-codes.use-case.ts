import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CHUNK_REPOSITORY, ChunkRepositoryPort } from '../../domain/ports/chunk.repository.port';
import { EMBEDDING_SERVICE, EmbeddingServicePort } from '../../domain/ports/embedding.service.port';

export interface CodeSuggestion {
  code: string;
  libelle: string;
  justification: string;
  regles_codage: string;
}

@Injectable()
export class SuggestCodesUseCase {
  private readonly openai: OpenAI;

  constructor(
    @Inject(CHUNK_REPOSITORY)
    private readonly chunkRepository: ChunkRepositoryPort,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingService: EmbeddingServicePort,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async execute(input: string): Promise<{ suggestions: CodeSuggestion[] }> {
    const queryEmbedding = await this.embeddingService.embed(input);
    const similarChunks = await this.chunkRepository.findSimilar(queryEmbedding, 5);

    const context = similarChunks
      .map((c) => c.content)
      .join('\n\n---\n\n');

    const prompt = `Tu es un expert en codage médical CIM-10.
Voici des extraits du document CoCoA (guide de codage officiel) :

${context}

En te basant uniquement sur ces extraits, suggère les codes CIM-10 les plus pertinents pour le symptôme ou diagnostic suivant :
"${input}"

Pour chaque code suggéré, fournis :
- Le code CIM-10
- Son libellé
- Une justification courte basée sur les extraits fournis
- Les règles de codage spécifiques mentionnées dans CoCoA si présentes

Réponds en JSON avec ce format :
{
  "suggestions": [
    {
      "code": "R06.0",
      "libelle": "Dyspnée",
      "justification": "...",
      "regles_codage": "..."
    }
  ]
}`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0].message.content ?? '{"suggestions":[]}';
    const parsed = JSON.parse(raw) as { suggestions: CodeSuggestion[] };
    return { suggestions: parsed.suggestions ?? [] };
  }
}