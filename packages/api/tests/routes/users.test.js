import supertest from "supertest";
import app from "../../src/index.js";
import prisma from "../../prisma/client.js";
import { createToken } from "../../src/util/token.js";
import { hashPassword } from "../../src/util/password.js";
import { Role } from "@prisma/client";

const request = supertest(app);
const endpoint = "/api/users";

describe(`Test endpoint ${endpoint}`, () => {
  let users = [
    {
      username: "user1",
      hashedPassword: hashPassword("user1"),
      email: "user1@test.io",
      role: Role.User,
    },
    {
      username: "user2",
      hashedPassword: hashPassword("user2"),
      email: "user2@test.io",
      role: Role.User,
    },
    {
      username: "user3",
      hashedPassword: hashPassword("user3"),
      email: "user3@test.io",
      role: Role.User,
    },
    {
      username: "user4",
      hashedPassword: hashPassword("user4"),
      email: "user4@test.io",
      role: Role.Admin,
    },
  ];

  beforeAll(async () => {
    // create the users
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });

    // Augment the users' objects with auth tokens
    users = users.map((user) => ({
      ...user,
      token: createToken({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      }),
      expiredToken: createToken({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        expiresIn: "0",
      }),
    }));

    const transactions = [];

    users.forEach((user) => {
      transactions.push(
        prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            token: user.token,
          },
        })
      );
    });

    await prisma.$transaction(transactions);
  });

  describe("HTTP GET request", () => {
    test("Return 401 when no authorization token is provided", async () => {
      const response = await request.get(`${endpoint}`);
      expect(response.status).toBe(401);
    });

    test("Return 401 when authorization token is expired", async () => {
      const response = await request
        .get(`${endpoint}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).expiredToken
        );
      expect(response.status).toBe(401);
    });

    test("Return 403 when authorization token belongs to a (regular) USER", async () => {
      const response = await request
        .get(`${endpoint}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.User).token
        );
      expect(response.status).toBe(403);
    });

    test("Return 200 with all users when authorization token belongs to an ADMIN", async () => {
      const response = await request
        .get(`${endpoint}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.map((user) => {
        expect(user.hashPassword).toBeUndefined();
      });
    });
  });

  describe("HTTP GET Request with QUERY parameter", () => {
    test("Return 200 with no users", async () => {
      const query_key = "username"; // some query key!
      const query_value = "non-existing"; // some invalid query value!
      const response = await request
        .get(`${endpoint}?${query_key}=${query_value}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    test("Return 200 with target user", async () => {
      const query_key = "username"; // some query key!
      const query_value = users[0].username; // some valid query value!
      const response = await request
        .get(`${endpoint}?${query_key}=${query_value}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.map((user) => {
        expect(user.hashPassword).toBeUndefined();
      });
    });
  });

  describe("HTTP GET Request with PATH parameter", () => {
    test("Return 401 when no authorization token is provided", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const response = await request.get(`${endpoint}/${id}`);
      expect(response.status).toBe(401);
    });

    test("Return 401 when authorization token is expired", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const response = await request
        .get(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).expiredToken
        );
      expect(response.status).toBe(401);
    });

    test("Return 403 when a USER attempts to access another USER account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const id = regularUsers[0].id; // valid user ID
      const response = await request
        .get(`${endpoint}/${id}`)
        .set("Authorization", "bearer " + regularUsers[1].token);
      expect(response.status).toBe(403);
    });

    test("Return 400 for bad request", async () => {
      const id = "one"; // invalid ID
      const response = await request
        .get(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 404 for user not found", async () => {
      const id = Number(users.slice(-1)[0].id) + 10; // user does not exist
      const response = await request
        .get(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(404);
    });

    test("Return 200 when an ADMIN request any user account", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const response = await request
        .get(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(Number(id));
      expect(response.body.data.hashPassword).toBeUndefined();
    });

    test("Return 200 when a USER attempts to access own account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const id = regularUsers[0].id; // valid user ID
      const response = await request
        .get(`${endpoint}/${id}`)
        .set("Authorization", "bearer " + regularUsers[0].token);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(Number(id));
      expect(response.body.data.hashPassword).toBeUndefined();
    });
  });

  describe("HTTP POST Request", () => {
    test("Return 401 when no authorization token is provided", async () => {
      const attributes = {
        email: "test_user@example.com",
        username: "test_user",
        password: "test_user",
      };
      const response = await request.post(`${endpoint}`).send(attributes);
      expect(response.status).toBe(401);
    });

    test("Return 401 when authorization token is expired", async () => {
      const attributes = {
        email: "test_user@example.com",
        username: "test_user",
        password: "test_user",
      };
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).expiredToken
        );
      expect(response.status).toBe(401);
    });

    test("Return 403 when a USER attempts to create an account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const attributes = {
        email: "test_user@example.com",
        username: "test_user",
        password: "test_user",
      };
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set("Authorization", "bearer " + regularUsers[1].token);
      expect(response.status).toBe(403);
    });

    test("Return 400 for bad request for providing extra attribute", async () => {
      const attributes = {
        email: "test_user@example.com",
        username: "test_user",
        password: "test_user",
        key: "value",
      }; // includes an invalid attribute!
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 400 for bad request for invalid email attribute", async () => {
      const attributes = {
        email: "test-user-email",
        username: "test_user",
        password: "test_user",
      }; // includes an invalid attribute!
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 400 for bad request for missing a required attribute", async () => {
      const attributes = {
        password: "test_user",
      }; // missing username attribute!
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 400 for bad request for invalid username", async () => {
      const attributes = {
        username: "test user",
      }; // missing username attribute!
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 201 for creating a user (with password)", async () => {
      const attributes = {
        email: "test_user_1@example.com",
        username: "test_user_1",
        password: "test_user_1",
      };
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe("test_user_1@example.com");
      expect(response.body.data.username).toBe("test_user_1");
      expect(response.body.data.hashPassword).toBeUndefined();
    });

    test("Return 201 for creating a user (without password)", async () => {
      const attributes = {
        email: "test_user_2@example.com",
        username: "test_user_2",
      };
      const response = await request
        .post(`${endpoint}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe("test_user_2@example.com");
      expect(response.body.data.username).toBe("test_user_2");
      expect(response.body.data.hashPassword).toBeUndefined();
    });
  });

  describe("HTTP PUT Request", () => {
    test("Return 401 when no authorization token is provided", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const attributes = {
        username: "updated name from test",
      };
      const response = await request.put(`${endpoint}/${id}`).send(attributes);
      expect(response.status).toBe(401);
    });

    test("Return 401 when authorization token is expired", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const attributes = {
        firstName: "updated name from test",
      };
      const response = await request
        .put(`${endpoint}/${id}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).expiredToken
        );
      expect(response.status).toBe(401);
    });

    test("Return 403 when a USER attempts to update another USER's account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const id = regularUsers[0].id; // valid user ID
      const attributes = {
        firstName: "updated name from test",
      };
      const response = await request
        .put(`${endpoint}/${id}`)
        .send(attributes)
        .set("Authorization", "bearer " + regularUsers[1].token);
      expect(response.status).toBe(403);
    });

    test("Return 400 for bad request for bad user ID", async () => {
      const id = "one"; // invalid ID
      const attributes = {
        firstName: "updated name from test",
      };
      const response = await request
        .put(`${endpoint}/${id}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 400 for bad request for bad user attribute", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const attributes = {
        key: "value",
      }; // an invalid attribute!
      const response = await request
        .put(`${endpoint}/${id}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 404 for user not found", async () => {
      const id = Number(users.slice(-1)[0].id) + 10; // user does not exist
      const attributes = {
        firstName: "updated name from test",
      };
      const response = await request
        .put(`${endpoint}/${id}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(404);
    });

    test("Return 200 when an ADMIN updates a user account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const id = regularUsers[1].id; // valid user ID
      const attributes = {
        firstName: "updated name from test",
        email: "new@email.com",
        password: "newPassword!",
      };
      const response = await request
        .put(`${endpoint}/${id}`)
        .send(attributes)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(Number(id));
      expect(response.body.data.firstName).toBe("updated name from test");
      expect(response.body.data.email).toBe("new@email.com");
      expect(response.body.data.hashPassword).toBeUndefined();
    });

    test("Return 200 when a USER attempts to update own account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const id = regularUsers[0].id; // valid user ID
      const attributes = {
        username: "new_user_name",
        lastName: "updated name from test",
      };
      const response = await request
        .put(`${endpoint}/${id}`)
        .send(attributes)
        .set("Authorization", "bearer " + regularUsers[0].token);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(Number(id));
      expect(response.body.data.username).toBe("new_user_name");
      expect(response.body.data.lastName).toBe("updated name from test");
      expect(response.body.data.hashPassword).toBeUndefined();
    });
  });

  describe("HTTP DELETE Request", () => {
    test("Return 401 when no authorization token is provided", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const response = await request.delete(`${endpoint}/${id}`);
      expect(response.status).toBe(401);
    });

    test("Return 401 when authorization token is expired", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const response = await request
        .delete(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).expiredToken
        );
      expect(response.status).toBe(401);
    });

    test("Return 403 when a USER attempts to delete another USER's account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const id = regularUsers[0].id; // valid user ID
      const response = await request
        .delete(`${endpoint}/${id}`)
        .set("Authorization", "bearer " + regularUsers[1].token);
      expect(response.status).toBe(403);
    });

    test("Return 400 for bad request", async () => {
      const id = "one"; // invalid ID
      const response = await request
        .delete(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(400);
    });

    test("Return 404 for user not found", async () => {
      const id = Number(users.slice(-1)[0].id) + 10; // user does not exist
      const response = await request
        .delete(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(404);
    });

    test("Return 200 for deleting an existing user", async () => {
      const id = users.slice(1)[0].id; // valid user ID
      const response = await request
        .delete(`${endpoint}/${id}`)
        .set(
          "Authorization",
          "bearer " + users.find((u) => u.role === Role.Admin).token
        );
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(Number(id));
      expect(response.body.data.hashPassword).toBeUndefined();
    });

    test("Return 200 when a USER attempts to delete own account", async () => {
      const regularUsers = users.filter((u) => u.role === Role.User);
      const id = regularUsers[0].id; // valid user ID
      const response = await request
        .delete(`${endpoint}/${id}`)
        .set("Authorization", "bearer " + regularUsers[0].token);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(Number(id));
      expect(response.body.data.hashPassword).toBeUndefined();
    });
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteUsers]);

    await prisma.$disconnect();
    // Tear down the test database by `yarn docker:down`
  });
});
