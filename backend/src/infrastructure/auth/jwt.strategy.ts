import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { createPublicKey } from "node:crypto";

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      secretOrKeyProvider: async (_req: any, _token: any, done: any) => {
        try {
          const res = await fetch(
            `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
          );
          const { keys } = (await res.json()) as { keys: any[] };
          const pem = createPublicKey({ key: keys[0], format: "jwk" }).export({
            type: "spki",
            format: "pem",
          });
          done(null, pem);
        } catch (err) {
          done(err);
        }
      },
      algorithms: ["ES256"],
    });
  }

  validate(payload: JwtPayload): { sub: string; email: string } {
    return { sub: payload.sub, email: payload.email };
  }
}
