import { Inject, Injectable, Logger } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { CIM10_ENTRY_REPOSITORY, Cim10EntryRepositoryPort } from "@/features/cim10/ports/cim10-entry.repository.port";
import { EMBEDDING_SERVICE, EmbeddingServicePort } from "@/features/cim10/ports/embedding.service.port";
import { Cim10Entry } from "@/features/cim10/entities/cim10-entry.entity";

interface ParsedCim10Entry {
  code: string;
  libelle: string;
  content: string;
}

@Injectable()
export class IngestDocumentUseCase {
  private readonly logger = new Logger(IngestDocumentUseCase.name);

  private readonly FULL_INGEST_THRESHOLD = 1000; // safety check to avoid duplicate ingestion during development
  private readonly EMBED_DELAY_MS = 700; // stay under 100 RPM
  private readonly MIN_CHUNK_LENGTH = 10;
  private readonly LOG_INTERVAL = 50;
  private readonly PDF_PATH = path.resolve(
    __dirname,
    "../../../../assets/CoCoA.pdf",
  );

  // CIM-10 code: one letter followed by 2 digits (optionally with sub-codes like R06.0)
  private readonly CIM10_CODE_PATTERN = /^([A-Z]\d{2}(?:\.\d+)?)\s+(.+)$/m;
  // Lookahead to split on lines that start with a CIM-10 code
  private readonly CIM10_BLOCK_PATTERN = /(?=^[A-Z]\d{2}(?:\.\d+)?\s)/gm;

  constructor(
    @Inject(CIM10_ENTRY_REPOSITORY)
    private readonly cim10EntryRepository: Cim10EntryRepositoryPort,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingService: EmbeddingServicePort,
  ) {}

  async execute(): Promise<{ message: string; count?: number }> {
    const existing = await this.cim10EntryRepository.count();
    if (existing >= this.FULL_INGEST_THRESHOLD) {
      this.logger.log(`Skipping ingestion — ${existing} CIM-10 entries already in DB`);
      return { message: "Already ingested", count: existing };
    }
    if (existing > 0) {
      this.logger.log(
        `Partial ingestion detected (${existing} CIM-10 entries) — clearing and restarting`,
      );
      await this.cim10EntryRepository.truncate();
    }

    this.logger.log(`Parsing PDF: ${this.PDF_PATH}`);

    const { PDFParse } = require("pdf-parse");
    const buffer = await fs.readFile(this.PDF_PATH);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    const text: string = data.text;

    const cim10Entries = this.splitIntoCim10Entries(text);
    this.logger.log(`Found ${cim10Entries.length} CIM-10 entries`);

    let saved = 0;
    for (const parsedCim10Entry of cim10Entries) {
      const embedding = await this.embeddingService.embed(parsedCim10Entry.content);

      const cim10Entry = new Cim10Entry({
        id: uuidv4(),
        content: parsedCim10Entry.content,
        metadata: { code: parsedCim10Entry.code, libelle: parsedCim10Entry.libelle },
        embedding,
      });

      await this.cim10EntryRepository.save(cim10Entry);
      saved++;
      // Delay to respect embedding service rate limits
      await new Promise((r) => setTimeout(r, this.EMBED_DELAY_MS));

      if (saved % this.LOG_INTERVAL === 0) {
        this.logger.log(`Saved ${saved}/${cim10Entries.length} CIM-10 entries`);
      }
    }

    this.logger.log(`Ingestion complete: ${saved} CIM-10 entries saved`);
    return { message: "Ingestion complete", count: saved };
  }

  private splitIntoCim10Entries(text: string): ParsedCim10Entry[] {
    const blocks = text.split(this.CIM10_BLOCK_PATTERN).filter(Boolean);

    const parsedCim10Entries: ParsedCim10Entry[] = [];
    for (const block of blocks) {
      const firstLine = block.split("\n")[0];
      const match = firstLine.match(this.CIM10_CODE_PATTERN);
      if (!match) continue;

      const code = match[1].trim();
      const libelle = match[2].trim();
      const content = block.trim();

      if (content.length < this.MIN_CHUNK_LENGTH) continue;

      parsedCim10Entries.push({ code, libelle, content });
    }

    return parsedCim10Entries;
  }
}
