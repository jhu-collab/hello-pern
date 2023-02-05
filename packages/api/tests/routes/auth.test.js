import supertest from "supertest";
import app from "../../src/index.js";
import prisma from "../../prisma/client.js";
import { hashPassword } from "../../src/util/password.js";
import { Role } from "@prisma/client";

const request = supertest(app);
const endpoint = "/authenticate";

describe(`Test endpoint ${endpoint}`, () => {
  let user = null;

  beforeAll(async () => {
    // create the users
    user = await prisma.user.create({
      data: {
        username: "user1",
        hashedPassword: hashPassword("user1"),
        email: "user1@test.io",
        role: Role.User,
      },
    });
  });

  describe("HTTP POST Request", () => {
    test("Return 400 when username is missing", async () => {
      const attributes = {
        password: "user1",
      };
      const response = await request.post(`${endpoint}`).send(attributes);
      expect(response.status).toBe(400);
    });

    test("Return 400 when password is missing", async () => {
      const attributes = {
        username: "user1",
      };
      const response = await request.post(`${endpoint}`).send(attributes);
      expect(response.status).toBe(400);
    });

    test("Return 403 when username is incorrect", async () => {
      const attributes = {
        username: "wrong-username",
        password: "user1",
      };
      const response = await request.post(`${endpoint}`).send(attributes);
      expect(response.status).toBe(403);
    });

    test("Return 403 when password is incorrect", async () => {
      const attributes = {
        username: "user1",
        password: "wrong-password",
      };
      const response = await request.post(`${endpoint}`).send(attributes);
      expect(response.status).toBe(403);
    });

    test("Return 200 for successful authentication", async () => {
      const attributes = {
        username: "user1",
        password: "user1",
      };
      const response = await request.post(`${endpoint}`).send(attributes);
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBeDefined();
      expect(response.body.token).toBeDefined();
    });
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteUsers]);

    await prisma.$disconnect();
    // Tear down the test database by `yarn docker:down`
  });
});
