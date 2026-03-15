import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { CreateUserProfileUseCase } from "../../../application/use-cases/create-user-profile.use-case";
import { GetUserProfileUseCase } from "../../../application/use-cases/get-user-profile.use-case";
import { DrizzleProvider } from "../../../infrastructure/db/drizzle.provider";
import { DrizzleUserRepository } from "../../../infrastructure/db/drizzle-user.repository";
import { AuthModule } from "../../../infrastructure/auth/auth.module";
import { USER_REPOSITORY } from "../../../domain/user/ports/user.repository.port";

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    DrizzleProvider,
    { provide: USER_REPOSITORY, useClass: DrizzleUserRepository },
    CreateUserProfileUseCase,
    GetUserProfileUseCase,
  ],
})
export class UsersModule {}
