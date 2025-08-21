const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../../app");
const {
  resetDatabase,
  initializeDatabase,
  initialUser,
} = require("../../helpers/seed_data");

const api = supertest(app);

describe("tests for blogs", () => {
  let token;

  after(async () => {
    await resetDatabase();
    await mongoose.connection.close();
    console.log("mongoose connection closed");
  });

  beforeEach(async () => {
    await resetDatabase();
    await initializeDatabase();

    const loginResponse = await api
      .post("/auth/login")
      .send({
        username: initialUser.username,
        password: initialUser.password,
      })
      .expect(200);
    token = loginResponse.body.token;
    console.log("token", token);
  });

  describe("test if 'id' is generated", () => {
    test("if 'id' is generated", async () => {
      const response = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);
      const blog = response.body[0];

      assert.strictEqual(blog.id.toString().length, 24);
    });
  });
});
