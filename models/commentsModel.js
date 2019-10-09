const connection = require('../db/connection')

exports.updateComment = ({ comment_id }, { inc_votes }) => {
  const int_comment_id = parseInt(comment_id)
  return connection.select('votes').from('comments').where('comment_id', int_comment_id).then(([{ votes }]) => {
    return connection('comments').where({ comment_id: int_comment_id }).update({ 'votes': votes + inc_votes }, ['*'])
  }).then(comment => comment[0])
}

exports.deleteComment = ({ comment_id }) => {
  return connection('comments').where({ comment_id }).del()

}