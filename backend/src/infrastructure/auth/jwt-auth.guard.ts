import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any) {
    this.logger.error(
      "JWT validation — err:",
      err?.message,
      "info:",
      info?.message,
    );
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
