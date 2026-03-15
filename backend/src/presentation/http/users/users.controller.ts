import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../../../infrastructure/auth/jwt-auth.guard";
import { CreateUserProfileUseCase } from "../../../application/use-cases/create-user-profile.use-case";
import { GetUserProfileUseCase } from "../../../application/use-cases/get-user-profile.use-case";
import { CreateProfileDto } from "./dtos/create-profile.dto";

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

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

  @Get("profile")
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.getUserProfileUseCase.execute(req.user.sub);
  }
}
