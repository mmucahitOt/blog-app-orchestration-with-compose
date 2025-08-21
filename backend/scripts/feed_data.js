const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");

const initialUser = {
  _id: new mongoose.Types.ObjectId("5a422a851b54a676234d17f7"),
  username: "test",
  name: "test",
  password: "test1234",
};

const initialBlogs = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: initialUser._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: initialUser._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: initialUser._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    user: initialUser._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    user: initialUser._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    user: initialUser._id,
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: "Test Blog",
    author: "Test Author",
    url: "https://test.com",
    likes: 2,
    user: initialUser._id,
    __v: 0,
  },
];

const seedUsers = async () => {
  const blogObjectIds = initialBlogs.map((blog) => blog._id);
  const passwordHash = await bcrypt.hash(initialUser.password, 10);
  await User.insertMany({
    _id: initialUser._id,
    username: initialUser.username,
    name: initialUser.name,
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

const initializeDatabase = async () => {
  await resetDatabase();
  await seedUsers();
  await seedBlogs();
};

mongoose
  .connect("mongodb://127.0.0.1:27017/blog_list?directConnection=true")
  .then(() => {
    logger.info("connected to MongoDB");
    initializeDatabase().then(() => {
      logger.info("database initialized");
      mongoose.connection.close();
    });
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });
