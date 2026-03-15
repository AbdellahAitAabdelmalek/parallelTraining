import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import OpenAI, { APIError } from "openai";
import { ChatServicePort } from "../../domain/cim10/ports/chat.service.port";
import { OPENAI_CLIENT } from "./openai.provider";

@Injectable()
export class OpenAIChatService implements ChatServicePort {
  private readonly logger = new Logger(OpenAIChatService.name);
  private readonly MODEL = "gpt-4o";

  constructor(@Inject(OPENAI_CLIENT) private readonly client: OpenAI) {}

  async complete(prompt: string): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      return completion.choices[0].message.content ?? "{}";
    } catch (err) {
      if (err instanceof APIError) {
        this.logger.error(
          `AI API error — status=${err.status} message=${err.message}`,
        );
      } else {
        this.logger.error("Unexpected error during AI completion", err);
      }
      throw new InternalServerErrorException("OpenAI request failed");
    }
  }
}
