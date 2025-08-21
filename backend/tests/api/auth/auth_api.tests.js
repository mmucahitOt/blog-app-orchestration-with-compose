const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../../app");
const { resetDatabase } = require("../../helpers/seed_data");

const api = supertest(app);

describe("tests for user api", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  after(async () => {
    await resetDatabase();
    await mongoose.connection.close();
    console.log("mongoose connection closed");
  });

  describe("test post /api/users", () => {
    test("a user can be created", async () => {
      const newUser = {
        username: "testuser",
        name: "Test User",
        password: "testpassword",
      };

      const response = await api.post("/api/users").send(newUser).expect(201);
      const createdUser = response.body;
      console.log(createdUser);
      assert.strictEqual(response.status, 201);
      assert.strictEqual(createdUser.username, createdUser.username);
      assert.strictEqual(createdUser.name, createdUser.name);
    });

    test("test user creation fails if username length is less than 3", async () => {
      const newUser = {
        username: "te",
        name: "Test User",
        password: "testpassword",
      };

      const response = await api.post("/api/users").send(newUser).expect(400);
      assert.strictEqual(response.status, 400);
    });

    test("test user creation fails if password length is less than 3", async () => {
      const newUser = {
        username: "testuser",
        name: "Test User",
        password: "te",
      };

      const response = await api.post("/api/users").send(newUser).expect(400);
      assert.strictEqual(response.status, 400);
    });
  });
});
