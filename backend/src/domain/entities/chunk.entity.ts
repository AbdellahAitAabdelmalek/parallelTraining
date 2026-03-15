export interface ChunkMetadata {
  code?: string;
  libelle?: string;
  [key: string]: unknown;
}

export class Chunk {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly metadata: ChunkMetadata,
    public readonly embedding: number[] | null,
    public readonly createdAt: Date,
  ) {}
}
