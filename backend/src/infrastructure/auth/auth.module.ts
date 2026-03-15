import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "@/infrastructure/auth/jwt.strategy";
import { JwtAuthGuard } from "@/infrastructure/auth/jwt-auth.guard";
import { AuthenticatedUserGuard } from "@/infrastructure/auth/authenticated-user.guard";
import { DrizzleProvider } from "@/infrastructure/db/drizzle.provider";
import { DrizzleUserRepository } from "@/infrastructure/db/drizzle-user.repository";
import { USER_REPOSITORY } from "@/features/user/ports/user.repository.port";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SUPABASE_JWT_SECRET,
    }),
  ],
  providers: [
    DrizzleProvider,
    { provide: USER_REPOSITORY, useClass: DrizzleUserRepository },
    JwtStrategy,
    JwtAuthGuard,
    AuthenticatedUserGuard,
  ],
  exports: [JwtAuthGuard, AuthenticatedUserGuard, USER_REPOSITORY],
})
export class AuthModule {}
