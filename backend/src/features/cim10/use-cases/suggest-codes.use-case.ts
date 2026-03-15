import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import {
  CIM10_ENTRY_REPOSITORY,
  Cim10EntryRepositoryPort,
} from "@/features/cim10/ports/cim10-entry.repository.port";
import {
  EMBEDDING_SERVICE,
  EmbeddingServicePort,
} from "@/features/cim10/ports/embedding.service.port";
import {
  CHAT_SERVICE,
  ChatServicePort,
} from "@/features/cim10/ports/chat.service.port";

export interface CodeSuggestion {
  code: string;
  libelle: string;
  justification: string;
  regles_codage: string;
}

@Injectable()
export class SuggestCodesUseCase {
  private readonly logger = new Logger(SuggestCodesUseCase.name);

  constructor(
    @Inject(CIM10_ENTRY_REPOSITORY)
    private readonly cim10EntryRepository: Cim10EntryRepositoryPort,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingService: EmbeddingServicePort,
    @Inject(CHAT_SERVICE)
    private readonly chatService: ChatServicePort,
  ) {}

  async execute(input: string): Promise<{ suggestions: CodeSuggestion[] }> {
    this.logger.log(`Suggesting codes for: "${input}"`);

    const queryEmbedding = await this.embeddingService.embed(input);
    const similarCim10Entries = await this.cim10EntryRepository.findSimilar(
      queryEmbedding,
      5,
    );

    const context = similarCim10Entries.map((cim10Entry) => cim10Entry.content).join("\n\n---\n\n");
    const prompt = this.buildPrompt(input, context);

    let responseRaw: string;
    try {
      responseRaw = await this.chatService.complete(prompt);
    } catch {
      throw new InternalServerErrorException(
        "Unable to get suggestions at this time",
      );
    }

    try {
      const parsed = JSON.parse(responseRaw) as {
        suggestions: CodeSuggestion[];
      };
      const suggestions = parsed.suggestions ?? [];
      this.logger.log(`Returning ${suggestions.length} suggestions`);
      return { suggestions };
    } catch {
      throw new InternalServerErrorException(
        "Invalid response format from AI model",
      );
    }
  }

  private buildPrompt(input: string, context: string): string {
    return `Tu es un expert en codage médical CIM-10.
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
  }
}
