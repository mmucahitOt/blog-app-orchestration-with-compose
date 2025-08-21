const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("./logger");

const test = {
  _id: new mongoose.Types.ObjectId("5a422a851b54a676234d17f7"),
  username: "test",
  name: "test",
  password: "test1234",
};

const initialBlogs = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Building Modern Web Applications with React",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: test._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "The Art of Clean Code: Best Practices for Developers",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: test._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Mastering JavaScript: From Basics to Advanced Concepts",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: test._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Full-Stack Development: A Complete Guide",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: test._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Node.js and Express: Building RESTful APIs",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: test._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Database Design: MongoDB vs SQL",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: test._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Welcome to Our Blog Platform",
    author: "test",
    url: "https://test.com",
    likes: 2,
    user: test._id,
    __v: 0,
  },
];

const seedUsers = async () => {
  const blogObjectIds = initialBlogs.map((blog) => blog._id);
  const passwordHash = await bcrypt.hash(test.password, 10);
  await User.insertMany({
    _id: test._id,
    username: test.username,
    name: test.name,
    passwordHash: passwordHash,
    blogs: blogObjectIds,
  });
};

const seedBlogs = async () => {
  await Blog.insertMany(initialBlogs);
};

const resetDatabase = async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
};

const feedData = async () => {
  const users = await User.find({});
  if (users.length === 0) {
    await resetDatabase();
    await seedUsers();
    await seedBlogs();
    logger.info("Data fed for production");
  } else {
    logger.info("Data already fed for production");
  }
};

module.exports = { feedData };
