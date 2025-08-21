const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../../app");
const {
  resetDatabase,
  initializeDatabase,
  initialUser,
  initialBlogs,
} = require("../../helpers/seed_data");

const api = supertest(app);

describe("test put /api/blogs/:id", () => {
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

  test("when a blog is liked, the likes are incremented", async () => {
    const blogToLike = initialBlogs[0];

    const updateResponse = await api
      .put(`/api/blogs/${blogToLike._id}`)
      .send({ likes: blogToLike.likes + 1 })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    assert.strictEqual(updateResponse.status, 200);

    const updatedBlog = updateResponse.body;
    assert.strictEqual(updatedBlog.likes, blogToLike.likes + 1);
  });
});
