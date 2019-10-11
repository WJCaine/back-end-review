const {
  selectArticle,
  updateArticle,
  insertArticleComment,
  selectArticleComments,
  selectArticles
} = require("../models/articlesModel.js");

exports.getArticle = (req, res, next) => {
  selectArticle(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getPatchedArticle = (req, res, next) => {
  console.log(Object.keys(req.body));
  if (!Object.keys(req.body).length) {
    selectArticle(req.params)
      .then(article => {
        res.status(200).send({ article });
      })
      .catch(next);
  } else {
    updateArticle(req.params, req.body)
      .then(article => {
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.getPostedArticleComment = (req, res, next) => {
  insertArticleComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  selectArticleComments(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
