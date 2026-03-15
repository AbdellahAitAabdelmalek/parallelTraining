import { Module } from "@nestjs/common";
import { CodageCim10Module } from "./presentation/http/codage-cim10/codage-cim10.module";
import { UsersModule } from "./presentation/http/users/users.module";

@Module({
  imports: [CodageCim10Module, UsersModule],
})
export class AppModule {}
