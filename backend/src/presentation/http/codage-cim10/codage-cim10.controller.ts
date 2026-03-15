import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../../infrastructure/auth/jwt-auth.guard";
import { AuthenticatedUserGuard } from "../../../infrastructure/auth/authenticated-user.guard";
import { IngestDocumentUseCase } from "../../../application/use-cases/ingest-document.use-case";
import { SuggestCodesUseCase } from "../../../application/use-cases/suggest-codes.use-case";
import { SuggestDto } from "./dtos/suggest.dto";

@UseGuards(JwtAuthGuard, AuthenticatedUserGuard)
@Controller("codage-cim10")
export class CodageCim10Controller {
  constructor(
    private readonly ingestUseCase: IngestDocumentUseCase,
    private readonly suggestUseCase: SuggestCodesUseCase,
  ) {}

  @Post("ingest")
  ingest() {
    return this.ingestUseCase.execute();
  }

  @Post("suggest")
  suggest(@Body() dto: SuggestDto) {
    return this.suggestUseCase.execute(dto.input);
  }
}
