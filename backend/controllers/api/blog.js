const Blog = require("../../models/blog");
const User = require("../../models/user");
const blogRouter = require("express").Router();
const mongoose = require("mongoose");
const { userIdExtractor } = require("../../utils/middleware");

blogRouter.use(userIdExtractor);

blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const userId = request.userId;

    const { title, author, url, likes } = request.body;

    const blog = new Blog({
      title,
      author,
      url,
      likes,
      comments: [],
      user: new mongoose.Types.ObjectId(userId),
    });
    const result = await blog.save();
    const userUpdateResult = await User.findByIdAndUpdate(userId, {
      $push: { blogs: result._id },
    });
    if (!userUpdateResult) {
      return response.status(400).json({ error: "User not found" });
    }
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/like/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:id/comments", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    await Blog.findByIdAndUpdate(request.params.id, {
      $pull: {
        comments: {
          _id: request.body.commentId,
        },
      },
    });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:id/comments", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
      $push: {
        comments: {
          _id: new mongoose.Types.ObjectId(),
          comment: request.body.comment,
        },
      },
    });
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:id", async (request, response, next) => {
  try {
    const userId = request.userId;

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    if (blog.user.toString() !== userId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
