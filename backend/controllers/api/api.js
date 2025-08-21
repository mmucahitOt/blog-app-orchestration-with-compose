const apiRouter = require("express").Router();
const blogRouter = require("./blog");
const userRouter = require("./user");
const commentRouter = require("./comment");
const { userIdExtractor, tokenExtractor } = require("../../utils/middleware");

apiRouter.use("/users", userRouter);

apiRouter.use(tokenExtractor);
apiRouter.use(userIdExtractor);

apiRouter.use("/blogs", blogRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;