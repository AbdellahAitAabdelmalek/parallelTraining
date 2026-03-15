import { Cim10Entry } from "../entities/cim10-entry.entity";

export const CIM10_ENTRY_REPOSITORY = Symbol("CIM10_ENTRY_REPOSITORY");

export interface Cim10EntryRepositoryPort {
  save(entry: Cim10Entry): Promise<void>;
  count(): Promise<number>;
  truncate(): Promise<void>;
  findSimilar(embedding: number[], limit: number): Promise<Cim10Entry[]>;
}
