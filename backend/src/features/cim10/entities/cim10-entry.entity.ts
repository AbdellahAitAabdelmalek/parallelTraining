export interface Cim10EntryMetadata {
  code?: string;
  libelle?: string;
  [key: string]: unknown;
}

export interface Cim10EntryProps {
  id: string;
  content: string;
  metadata: Cim10EntryMetadata;
  embedding: number[] | null;
  createdAt?: Date;
}

export class Cim10Entry {
  public readonly id: string;
  public readonly content: string;
  public readonly metadata: Cim10EntryMetadata;
  public readonly embedding: number[] | null;
  public readonly createdAt: Date;

  constructor({
    id,
    content,
    metadata,
    embedding,
    createdAt,
  }: Cim10EntryProps) {
    this.id = id;
    this.content = content;
    this.metadata = metadata;
    this.embedding = embedding;
    this.createdAt = createdAt ?? new Date();
  }
}
