const usersRouter = require("./usersRouter");
const topicsRouter = require("./topicsRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const apiRouter = require("express").Router();
const { send405 } = require("../Error_handling/errorHandler");
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.route("/").all(send405);

module.exports = apiRouter;
