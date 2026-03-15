import { Controller, UseGuards } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { contract } from "@parallel/contract";
import { JwtAuthGuard } from "@/infrastructure/auth/jwt-auth.guard";
import { AuthenticatedUserGuard } from "@/infrastructure/auth/authenticated-user.guard";
import { IngestDocumentUseCase } from "@/features/cim10/use-cases/ingest-document.use-case";
import { SuggestCodesUseCase } from "@/features/cim10/use-cases/suggest-codes.use-case";

@UseGuards(JwtAuthGuard, AuthenticatedUserGuard)
@Controller()
export class CodageCim10Controller {
  constructor(
    private readonly ingestUseCase: IngestDocumentUseCase,
    private readonly suggestUseCase: SuggestCodesUseCase,
  ) {}

  @TsRestHandler(contract.cim10.ingest)
  ingest() {
    return tsRestHandler(contract.cim10.ingest, async () => {
      await this.ingestUseCase.execute();
      return { status: 201 as const, body: {} };
    });
  }

  @TsRestHandler(contract.cim10.suggest)
  suggest() {
    return tsRestHandler(contract.cim10.suggest, async ({ body }) => {
      const result = await this.suggestUseCase.execute(body.input);
      return { status: 201 as const, body: result };
    });
  }
}
