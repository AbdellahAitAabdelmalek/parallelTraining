import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../../../infrastructure/auth/jwt-auth.guard";
import { AuthenticatedUserGuard } from "../../../infrastructure/auth/authenticated-user.guard";
import { CreateUserProfileUseCase } from "../../../features/user/use-cases/create-user-profile.use-case";
import { GetUserProfileUseCase } from "../../../features/user/use-cases/get-user-profile.use-case";
import { CreateProfileDto } from "./dtos/create-profile.dto";

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string };
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("profile")
  createProfile(@Req() req: AuthenticatedRequest, @Body() dto: CreateProfileDto) {
    return this.createUserProfileUseCase.execute({
      id: req.user.sub,
      email: req.user.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: new Date(dto.dateOfBirth),
    });
  }

  @UseGuards(JwtAuthGuard, AuthenticatedUserGuard)
  @Get("profile")
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.getUserProfileUseCase.execute(req.user.sub);
  }
}
