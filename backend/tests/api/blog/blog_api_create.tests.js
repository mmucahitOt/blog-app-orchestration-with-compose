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

  describe("test get /api/blogs", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
      const response = await api
        .get("/api/blogs")
        .set("Authorization", `Bearer ${token}`);

      assert.strictEqual(response.body.length, initialBlogs.length);
    });
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

  describe("test post /api/blogs", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "https://test.com",
        likes: 0,
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201);
      const createdBlog = response.body;

      assert.strictEqual(createdBlog.id.toString().length, 24);
      assert.strictEqual(createdBlog.title, "Test Blog");
      assert.strictEqual(createdBlog.author, "Test Author");
      assert.strictEqual(createdBlog.url, "https://test.com");
      assert.strictEqual(createdBlog.likes, 0);
    });

    test("default value of 'likes' is 0", async () => {
      const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "https://test.com",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201);
      const createdBlog = response.body;

      assert.strictEqual(createdBlog.likes, 0);
    });

    test("if title is missing, return 400", async () => {
      const newBlog = {
        author: "Test Author",
        url: "https://test.com",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("if url is missing, return 400", async () => {
      const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("if token is missing, return 401", async () => {
      const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "https://test.com",
      };

      const response = await api.post("/api/blogs").send(newBlog);
      assert.strictEqual(response.status, 401);
    });
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

  describe("test put /api/blogs/:id", () => {
    test("a blog can be updated", async () => {
      const blogToUpdate = initialBlogs[0];
      const updatedBlog = {
        title: "Updated Blog",
        author: "Updated Author",
        likes: 99,
      };

      const updateResponse = await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedBlog)
        .expect(200);
      assert.strictEqual(updateResponse.status, 200);
      assert.strictEqual(updateResponse.body.title, "Updated Blog");
      assert.strictEqual(updateResponse.body.author, "Updated Author");
      assert.strictEqual(updateResponse.body.likes, 99);
    });
  });
});
