const { sendEndpoints } = require("../controllers/apiController");
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
console.log("what'sthis", sendEndPoints);
apiRouter
  .route("/")
  .get(sendEndpoints)
  .all(send405);

module.exports = apiRouter;
