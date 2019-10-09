const { getArticle, getPatchedArticle, getPostedArticleComment, getArticleComments, getArticles } = require('../controllers/articlesController.js')
const articlesRouter = require('express').Router();
articlesRouter.route('/:article_id').get(getArticle).patch(getPatchedArticle)
articlesRouter.route('/:article_id/comments').post(getPostedArticleComment).get(getArticleComments)
articlesRouter.route('/').get(getArticles)

module.exports = articlesRouter