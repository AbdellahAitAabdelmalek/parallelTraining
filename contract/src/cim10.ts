import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const CodeSuggestionSchema = z.object({
  code: z.string(),
  libelle: z.string(),
  justification: z.string(),
  regles_codage: z.string(),
});

export const cim10Contract = c.router({
  suggest: {
    method: "POST",
    path: "/codage-cim10/suggest",
    body: z.object({ input: z.string().min(1) }),
    responses: {
      201: z.object({ suggestions: z.array(CodeSuggestionSchema) }),
    },
  },
  ingest: {
    method: "POST",
    path: "/codage-cim10/ingest",
    body: z.undefined(),
    responses: {
      201: z.unknown(),
    },
  },
});

export type CodeSuggestion = z.infer<typeof CodeSuggestionSchema>;
