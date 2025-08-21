const User = require("../models/user");
const Blog = require("../models/blog");
const testRouter = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

testRouter.post("/create-user", async (request, response) => {
  const { username, name, password, id, blogs } = request.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const userOptions = { username, name, passwordHash };
  if (id) {
    userOptions._id = new mongoose.Types.ObjectId(id);
  }
  if (blogs) {
    userOptions.blogs = blogs.map((blog) => new mongoose.Types.ObjectId(blog));
  } else {
    userOptions.blogs = [];
  }
  const user = new User(userOptions);
  await user.save();
  response.json(user);
});

testRouter.post("/create-blog", async (request, response) => {
  const { title, author, url, userId, id, likes } = request.body;
  const blogOptions = { title, author, url, likes: likes || 0 };
  if (userId) {
    blogOptions.user = new mongoose.Types.ObjectId(userId);
  }
  if (id) {
    blogOptions._id = new mongoose.Types.ObjectId(id);
  }
  const blog = new Blog(blogOptions);
  await blog.save();
  response.json(blog);
});

testRouter.get("/reset-database", async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  response.json({ message: "Database reset" });
});

module.exports = testRouter;
