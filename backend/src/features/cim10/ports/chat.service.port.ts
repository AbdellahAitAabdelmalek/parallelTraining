export const CHAT_SERVICE = "CHAT_SERVICE";

export interface ChatServicePort {
  complete(prompt: string): Promise<string>;
}
