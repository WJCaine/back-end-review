const { getUser } = require("../controllers/usersController");
const { send405 } = require("../Error_handling/errorHandler");
const usersRouter = require("express").Router();

usersRouter
  .route("/:username")
  .get(getUser)
  .all(send405);

module.exports = usersRouter;
