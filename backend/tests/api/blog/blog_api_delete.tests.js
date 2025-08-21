const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../../app");
const {
  resetDatabase,
  initialBlogs,
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

  describe("test delete /api/blogs/:id", () => {
    test("a blog can be deleted", async () => {
      const blogToDelete = initialBlogs[0];

      const deleteResponse = await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
      assert.strictEqual(deleteResponse.status, 204);

      const response = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);
      assert.strictEqual(
        response.body.length,
        initialBlogs.length - 1,
        "blog was not deleted"
      );
    });
  });
});
