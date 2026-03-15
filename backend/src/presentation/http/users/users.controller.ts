import { Controller, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { contract } from "@parallel/contract";
import { JwtAuthGuard } from "@/infrastructure/auth/jwt-auth.guard";
import { AuthenticatedUserGuard } from "@/infrastructure/auth/authenticated-user.guard";
import { CreateUserProfileUseCase } from "@/features/user/use-cases/create-user-profile.use-case";
import { GetUserProfileUseCase } from "@/features/user/use-cases/get-user-profile.use-case";

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string };
}

@Controller()
export class UsersController {
  constructor(
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @TsRestHandler(contract.users.createProfile)
  createProfile(@Req() req: AuthenticatedRequest) {
    return tsRestHandler(contract.users.createProfile, async ({ body }) => {
      const user = await this.createUserProfileUseCase.execute({
        id: req.user.sub,
        email: req.user.email,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth),
      });
      return {
        status: 201 as const,
        body: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth.toISOString(),
        },
      };
    });
  }

  @UseGuards(JwtAuthGuard, AuthenticatedUserGuard)
  @TsRestHandler(contract.users.getProfile)
  getProfile(@Req() req: AuthenticatedRequest) {
    return tsRestHandler(contract.users.getProfile, async () => {
      const user = await this.getUserProfileUseCase.execute(req.user.sub);
      return {
        status: 200 as const,
        body: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth.toISOString(),
        },
      };
    });
  }
}
