import { Module } from "@nestjs/common";
import { CodageCim10Controller } from "./codage-cim10.controller";
import { IngestDocumentUseCase } from "../../../features/cim10/use-cases/ingest-document.use-case";
import { SuggestCodesUseCase } from "../../../features/cim10/use-cases/suggest-codes.use-case";
import { DrizzleProvider } from "../../../infrastructure/db/drizzle.provider";
import { DrizzleCim10EntryRepository } from "../../../infrastructure/db/drizzle-cim10-entry.repository";
import { OpenAIEmbeddingService } from "../../../infrastructure/openai/openai-embedding.service";
import { OpenAIChatService } from "../../../infrastructure/openai/openai-chat.service";
import { OpenAIProvider } from "../../../infrastructure/openai/openai.provider";
import { CIM10_ENTRY_REPOSITORY } from "../../../features/cim10/ports/cim10-entry.repository.port";
import { EMBEDDING_SERVICE } from "../../../features/cim10/ports/embedding.service.port";
import { CHAT_SERVICE } from "../../../features/cim10/ports/chat.service.port";
import { AuthModule } from "../../../infrastructure/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [CodageCim10Controller],
  providers: [
    DrizzleProvider,
    OpenAIProvider,
    { provide: CIM10_ENTRY_REPOSITORY, useClass: DrizzleCim10EntryRepository },
    { provide: EMBEDDING_SERVICE, useClass: OpenAIEmbeddingService },
    { provide: CHAT_SERVICE, useClass: OpenAIChatService },
    IngestDocumentUseCase,
    SuggestCodesUseCase,
  ],
})
export class CodageCim10Module {}
