const { default: mongoose } = require("mongoose");
const Blog = require("../../models/blog");
const commentRouter = require("express").Router();
const { userIdExtractor } = require("../../utils/middleware");

commentRouter.use(userIdExtractor);

commentRouter.put("/comment/:id", async (request, response, next) => {
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

commentRouter.delete("/:id", async (request, response, next) => {
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

module.exports = commentRouter;
