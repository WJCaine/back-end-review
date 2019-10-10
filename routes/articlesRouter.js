const {
  getArticle,
  getPatchedArticle,
  getPostedArticleComment,
  getArticleComments,
  getArticles
} = require("../controllers/articlesController.js");
const { send405 } = require("../Error_handling/errorHandler");
const articlesRouter = require("express").Router();
articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(getPatchedArticle)
  .all(send405);
articlesRouter
  .route("/:article_id/comments")
  .post(getPostedArticleComment)
  .get(getArticleComments)
  .all(send405);
articlesRouter
  .route("/")
  .get(getArticles)
  .all(send405);

module.exports = articlesRouter;
