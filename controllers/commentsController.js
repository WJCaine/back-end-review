const {
  updateComment,
  deleteComment,
  selectComment
} = require("../models/commentsModel");

exports.sendComment = (req, res, next) => {
  selectComment(req.params).then(comment => {
    res.status(200).send({ comment });
  });
};

exports.sendPatchedComment = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    selectComment(req.params).then(comment => {
      res.status(200).send({ comment });
    });
  } else {
    updateComment(req.params, req.body)
      .then(comment => {
        res.status(200).send({ comment });
      })
      .catch(next);
  }
};

exports.sendDeleteComment = (req, res, next) => {
  deleteComment(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
