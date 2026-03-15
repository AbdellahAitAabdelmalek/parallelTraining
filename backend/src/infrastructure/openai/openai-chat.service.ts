import { Inject, Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ChatServicePort } from "../../domain/ports/chat.service.port";
import { OPENAI_CLIENT } from "./openai.provider";

@Injectable()
export class OpenAIChatService implements ChatServicePort {
  private readonly MODEL = "gpt-4o";

  constructor(@Inject(OPENAI_CLIENT) private readonly client: OpenAI) {}

  async complete(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content ?? "{}";
  }
}
