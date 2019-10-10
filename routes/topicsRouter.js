const { getTopics } = require("../controllers/topicsController");
const { send405 } = require("../Error_handling/errorHandler");
const topicsRouter = require("express").Router();

topicsRouter
  .route("/")
  .get(getTopics)
  .all(send405);

module.exports = topicsRouter;
