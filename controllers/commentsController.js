const { updateComment, deleteComment } = require('../models/commentsModel')

exports.sendPatchedComment = (req, res, next) => {
  updateComment(req.params, req.body).then(comment => {
    res.status(201).send(comment)
  })
}

exports.sendDeleteComment = (req, res, next) => {
  deleteComment(req.params).then(() => {
    res.sendStatus(204)
  })

}