import { Body, Controller, Post } from "@nestjs/common";
import { IngestDocumentUseCase } from "../../../application/use-cases/ingest-document.use-case";
import { SuggestCodesUseCase } from "../../../application/use-cases/suggest-codes.use-case";
import { SuggestDto } from "./dtos/suggest.dto";

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
