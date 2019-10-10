const connection = require("../db/connection");

exports.updateComment = ({ comment_id }, { inc_votes }) => {
  if (!inc_votes)
    return Promise.reject({
      msg: "invalid formatting on body of request",
      status: 400
    });
  const int_comment_id = parseInt(comment_id);
  return connection
    .select("votes")
    .from("comments")
    .where("comment_id", int_comment_id)
    .then(body => {
      if (!body.length)
        return Promise.reject({ msg: "No such comment found", status: 404 });
      else return body;
    })
    .then(([{ votes }]) => {
      return connection("comments")
        .where({ comment_id: int_comment_id })
        .update({ votes: votes + inc_votes }, ["*"]);
    })
    .then(comment => comment[0]);
};

exports.deleteComment = ({ comment_id }) => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(delCount => {
      if (!delCount)
        return Promise.reject({
          msg: "Item to be deleted could not be found",
          status: 404
        });
      else return delCount;
    });
};
