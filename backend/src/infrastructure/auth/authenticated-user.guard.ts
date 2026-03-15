import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from "@/features/user/ports/user.repository.port";

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { sub: string } }>();
    const userId = request.user?.sub;
    if (!userId) throw new UnauthorizedException();
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException("User not found in database");
    return true;
  }
}
