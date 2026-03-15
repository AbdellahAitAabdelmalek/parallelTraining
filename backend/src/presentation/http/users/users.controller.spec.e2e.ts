import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { eq } from "drizzle-orm";
import { createTestApp, TEST_USER } from "@/test/create-test-app";
import { DRIZZLE_DB, DrizzleDb } from "@/infrastructure/db/drizzle.provider";
import { users } from "@/infrastructure/db/schemas/user-schema";

describe("UsersController (e2e)", () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let db: DrizzleDb;

  beforeAll(async () => {
    ({ app, moduleRef } = await createTestApp());
    db = moduleRef.get<DrizzleDb>(DRIZZLE_DB);
    await db.delete(users).where(eq(users.id, TEST_USER.sub));
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, TEST_USER.sub));
    await app.close();
  });

  describe("POST /users/profile", () => {
    it("201 — creates the user profile", async () => {
      const res = await request(app.getHttpServer())
        .post("/users/profile")
        .send({ firstName: "Jean", lastName: "Dupont", dateOfBirth: "1990-05-15" })
        .expect(201);

      expect(res.body).toMatchObject({
        id: TEST_USER.sub,
        email: TEST_USER.email,
        firstName: "Jean",
        lastName: "Dupont",
      });
    });

    it("409 — conflict when profile already exists", async () => {
      await request(app.getHttpServer())
        .post("/users/profile")
        .send({ firstName: "Jean", lastName: "Dupont", dateOfBirth: "1990-05-15" })
        .expect(409);
    });

    it("400 — validation fails when fields are missing", async () => {
      await request(app.getHttpServer())
        .post("/users/profile")
        .send({ firstName: "Jean" })
        .expect(400);
    });
  });

  describe("GET /users/profile", () => {
    it("200 — returns the authenticated user's profile", async () => {
      const res = await request(app.getHttpServer())
        .get("/users/profile")
        .expect(200);

      expect(res.body).toMatchObject({
        id: TEST_USER.sub,
        firstName: "Jean",
        lastName: "Dupont",
      });
    });

    it("404 — returns 404 when profile does not exist", async () => {
      await db.delete(users).where(eq(users.id, TEST_USER.sub));

      await request(app.getHttpServer()).get("/users/profile").expect(404);
    });
  });
});
