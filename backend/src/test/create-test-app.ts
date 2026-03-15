import {
  INestApplication,
  ValidationPipe,
  ExecutionContext,
} from "@nestjs/common";
import { Test, TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { AppModule } from "@/app.module";
import { JwtAuthGuard } from "@/infrastructure/auth/jwt-auth.guard";
import { AuthenticatedUserGuard } from "@/infrastructure/auth/authenticated-user.guard";

export const TEST_USER = {
  sub: "00000000-0000-0000-0000-000000000001",
  email: "test@example.com",
};

export async function createTestApp(
  overrides?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<{ app: INestApplication; moduleRef: TestingModule }> {
  let builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (ctx: ExecutionContext) => {
        ctx.switchToHttp().getRequest().user = TEST_USER;
        return true;
      },
    })
    .overrideGuard(AuthenticatedUserGuard)
    .useValue({ canActivate: () => true });

  if (overrides) {
    builder = overrides(builder);
  }

  const moduleRef = await builder.compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();

  return { app, moduleRef };
}
