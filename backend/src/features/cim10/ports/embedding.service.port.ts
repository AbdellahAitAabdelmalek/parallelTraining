export const EMBEDDING_SERVICE = Symbol("EMBEDDING_SERVICE");

export interface EmbeddingServicePort {
  embed(text: string): Promise<number[]>;
}
