import { Module } from "@nestjs/common";
import { UsersController } from "@/presentation/http/users/users.controller";
import { CreateUserProfileUseCase } from "@/features/user/use-cases/create-user-profile.use-case";
import { GetUserProfileUseCase } from "@/features/user/use-cases/get-user-profile.use-case";
import { DrizzleProvider } from "@/infrastructure/db/drizzle.provider";
import { DrizzleUserRepository } from "@/infrastructure/db/drizzle-user.repository";
import { AuthModule } from "@/infrastructure/auth/auth.module";
import { USER_REPOSITORY } from "@/features/user/ports/user.repository.port";

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
