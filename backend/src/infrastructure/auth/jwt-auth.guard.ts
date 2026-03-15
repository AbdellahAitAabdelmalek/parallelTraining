import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.error("JWT validation error:", err);
      if (info) {
        this.logger.warn("JWT validation failed — info:", info);
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
