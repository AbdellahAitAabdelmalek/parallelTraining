import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { createTestApp } from "@/test/create-test-app";
import { EMBEDDING_SERVICE } from "@/features/cim10/ports/embedding.service.port";
import { CHAT_SERVICE } from "@/features/cim10/ports/chat.service.port";

const MOCK_SUGGESTIONS = {
  suggestions: [
    {
      code: "R06.0",
      libelle: "Dyspnée",
      justification: "Mentionné dans le contexte CoCoA",
      regles_codage: "Coder en principal si symptôme principal",
    },
  ],
};

describe("CodageCim10Controller (e2e)", () => {
  let app: INestApplication;

  const mockEmbed = jest.fn();
  const mockComplete = jest.fn();

  beforeAll(async () => {
    ({ app } = await createTestApp((builder) =>
      builder
        .overrideProvider(EMBEDDING_SERVICE)
        .useValue({ embed: mockEmbed })
        .overrideProvider(CHAT_SERVICE)
        .useValue({ complete: mockComplete }),
    ));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /codage-cim10/suggest", () => {
    it("201 — returns suggestions for a valid input", async () => {
      mockEmbed.mockResolvedValue(new Array(1536).fill(0));
      mockComplete.mockResolvedValue(JSON.stringify(MOCK_SUGGESTIONS));

      const res = await request(app.getHttpServer())
        .post("/codage-cim10/suggest")
        .send({ input: "dyspnée au repos" })
        .expect(201);

      expect(res.body).toMatchObject({
        suggestions: expect.arrayContaining([
          expect.objectContaining({ code: "R06.0", libelle: "Dyspnée" }),
        ]),
      });
      expect(mockEmbed).toHaveBeenCalledWith("dyspnée au repos");
      expect(mockComplete).toHaveBeenCalledTimes(1);
    });

    it("400 — validation fails when input is missing", async () => {
      await request(app.getHttpServer())
        .post("/codage-cim10/suggest")
        .send({})
        .expect(400);

      expect(mockEmbed).not.toHaveBeenCalled();
    });

    it("400 — validation fails when input is an empty string", async () => {
      await request(app.getHttpServer())
        .post("/codage-cim10/suggest")
        .send({ input: "" })
        .expect(400);
    });
  });
});
