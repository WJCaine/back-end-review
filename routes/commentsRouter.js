const {
  sendPatchedComment,
  sendDeleteComment
} = require("../controllers/commentsController");
const { send405 } = require("../Error_handling/errorHandler");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .patch(sendPatchedComment)
  .delete(sendDeleteComment)
  .all(send405);

module.exports = commentsRouter;
