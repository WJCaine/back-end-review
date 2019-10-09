const { sendPatchedComment, sendDeleteComment } = require('../controllers/commentsController')
const commentsRouter = require('express').Router()

commentsRouter.route('/:comment_id').patch(sendPatchedComment).delete(sendDeleteComment)

module.exports = commentsRouter