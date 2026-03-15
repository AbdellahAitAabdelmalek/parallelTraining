import { Module } from "@nestjs/common";
import { CodageCim10Module } from "./presentation/http/codage-cim10/codage-cim10.module";

@Module({
  imports: [CodageCim10Module],
})
export class AppModule {}
