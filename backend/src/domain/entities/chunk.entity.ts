export interface ChunkMetadata {
  code?: string;
  libelle?: string;
  [key: string]: unknown;
}

export interface ChunkProps {
  id: string;
  content: string;
  metadata: ChunkMetadata;
  embedding: number[] | null;
  createdAt?: Date;
}

export class Chunk {
  public readonly id: string;
  public readonly content: string;
  public readonly metadata: ChunkMetadata;
  public readonly embedding: number[] | null;
  public readonly createdAt: Date;

  constructor({ id, content, metadata, embedding, createdAt }: ChunkProps) {
    this.id = id;
    this.content = content;
    this.metadata = metadata;
    this.embedding = embedding;
    this.createdAt = createdAt ?? new Date();
  }
}
