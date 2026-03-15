import { Inject, Injectable, Logger } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { CHUNK_REPOSITORY } from "../../domain/ports/chunk.repository.port";
import { ChunkRepositoryPort } from "../../domain/ports/chunk.repository.port";
import { EMBEDDING_SERVICE } from "../../domain/ports/embedding.service.port";
import { EmbeddingServicePort } from "../../domain/ports/embedding.service.port";
import { Chunk } from "../../domain/entities/chunk.entity";

interface ParsedChunk {
  code: string;
  libelle: string;
  content: string;
}

@Injectable()
export class IngestDocumentUseCase {
  private readonly logger = new Logger(IngestDocumentUseCase.name);

  constructor(
    @Inject(CHUNK_REPOSITORY)
    private readonly chunkRepository: ChunkRepositoryPort,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingService: EmbeddingServicePort,
  ) {}

  private readonly FULL_INGEST_THRESHOLD = 1000; // safety check to avoid duplicate ingestion during development
  private readonly EMBED_DELAY_MS = 700; // stay under 100 RPM

  async execute(): Promise<{ message: string; count?: number }> {
    const existing = await this.chunkRepository.count();
    if (existing >= this.FULL_INGEST_THRESHOLD) {
      this.logger.log(`Skipping ingestion — ${existing} chunks already in DB`);
      return { message: "Already ingested", count: existing };
    }
    if (existing > 0) {
      this.logger.log(
        `Partial ingestion detected (${existing} chunks) — clearing and restarting`,
      );
      await this.chunkRepository.truncate();
    }

    const pdfPath = path.resolve(__dirname, "../../../../assets/CoCoA.pdf");

    this.logger.log(`Parsing PDF: ${pdfPath}`);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PDFParse } = require("pdf-parse");
    const buffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    const text: string = data.text;

    const chunks = this.splitIntoChunks(text);
    this.logger.log(`Found ${chunks.length} CIM-10 chunks`);

    let saved = 0;
    for (const parsed of chunks) {
      const embedding = await this.embeddingService.embed(parsed.content);
      const chunk = new Chunk(
        uuidv4(),
        parsed.content,
        { code: parsed.code, libelle: parsed.libelle },
        embedding,
        new Date(),
      );
      await this.chunkRepository.save(chunk);
      saved++;
      await new Promise((r) => setTimeout(r, this.EMBED_DELAY_MS));
      if (saved % 50 === 0) {
        this.logger.log(`Saved ${saved}/${chunks.length} chunks`);
      }
    }

    this.logger.log(`Ingestion complete: ${saved} chunks saved`);
    return { message: "Ingestion complete", count: saved };
  }

  private splitIntoChunks(text: string): ParsedChunk[] {
    // CIM-10 codes: one letter followed by 2 digits (optionally with sub-codes like R06.0)
    const codePattern = /^([A-Z]\d{2}(?:\.\d+)?)\s+(.+)$/m;
    // Split on lines that start with a CIM-10 code
    const blockPattern = /(?=^[A-Z]\d{2}(?:\.\d+)?\s)/m;

    const blocks = text.split(new RegExp(blockPattern, "gm")).filter(Boolean);

    const parsed: ParsedChunk[] = [];
    for (const block of blocks) {
      const firstLine = block.split("\n")[0];
      const match = firstLine.match(codePattern);
      if (!match) continue;

      const code = match[1].trim();
      const libelle = match[2].trim();
      const content = block.trim();

      if (content.length < 10) continue;

      parsed.push({ code, libelle, content });
    }

    return parsed;
  }
}
