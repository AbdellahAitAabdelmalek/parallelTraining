import { Module } from "@nestjs/common";
import { RagController } from "./rag.controller";
import { IngestDocumentUseCase } from "../../application/use-cases/ingest-document.use-case";
import { SuggestCodesUseCase } from "../../application/use-cases/suggest-codes.use-case";
import { DrizzleProvider } from "../../infrastructure/db/drizzle.provider";
import { DrizzleChunkRepository } from "../../infrastructure/db/drizzle-chunk.repository";
import { OpenAIEmbeddingService } from "../../infrastructure/openai/openai-embedding.service";
import { OpenAIChatService } from "../../infrastructure/openai/openai-chat.service";
import { OpenAIProvider } from "../../infrastructure/openai/openai.provider";
import { CHUNK_REPOSITORY } from "../../domain/ports/chunk.repository.port";
import { EMBEDDING_SERVICE } from "../../domain/ports/embedding.service.port";
import { CHAT_SERVICE } from "../../domain/ports/chat.service.port";

@Module({
  controllers: [RagController],
  providers: [
    DrizzleProvider,
    OpenAIProvider,
    { provide: CHUNK_REPOSITORY, useClass: DrizzleChunkRepository },
    { provide: EMBEDDING_SERVICE, useClass: OpenAIEmbeddingService },
    { provide: CHAT_SERVICE, useClass: OpenAIChatService },
    IngestDocumentUseCase,
    SuggestCodesUseCase,
  ],
})
export class RagModule {}
