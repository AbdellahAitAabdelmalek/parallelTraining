import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

const REQUIRED_ENV_VARS = ["OPENAI_API_KEY", "DATABASE_URL", "SUPABASE_URL"];

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Automatically strip unknown properties from DTOs
  app.enableCors();
  await app.listen(3000);
  console.log("Backend running on http://localhost:3000");
}
bootstrap();
