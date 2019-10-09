const connection = require("../db/connection");

exports.selectArticle = ({ article_id }) => {
  const int_article_id = parseInt(article_id);
  const articleRequest = connection
    .select()
    .from("articles")
    .where("article_id", int_article_id);
  const comment_count = connection
    .select()
    .from("comments")
    .where("article_id", int_article_id);
  return Promise.all([articleRequest, comment_count]).then(
    ([article, comment_count]) => {
      if (!article.length)
        return Promise.reject({ msg: "No such article found", status: 404 });
      else {
        article[0].comment_count = comment_count.length;
        return article[0];
      }
    }
  );
};

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  const int_article_id = parseInt(article_id);
  return connection
    .select("votes")
    .from("articles")
    .where("article_id", int_article_id)
    .then(article => {
      console.log(article);
      if (!article.length)
        return Promise.reject({ msg: "No such article found", status: 404 });

      [{ votes }] = article;
      const articleRequest = connection("articles")
        .where({ article_id: int_article_id })
        .update({ votes: votes + inc_votes }, ["*"]);
      const comment_count = connection
        .select()
        .from("comments")
        .where("article_id", int_article_id);
      return Promise.all([articleRequest, comment_count]).then(
        ([article, comment_count]) => {
          article[0].comment_count = comment_count.length;
          return article[0];
        }
      );
    });
};

exports.insertArticleComment = ({ article_id }, body) => {
  return connection("comments")
    .insert(
      { author: body.username, body: body.body, article_id: article_id },
      ["*"]
    )
    .then(comment => comment[0]);
};

exports.selectArticleComments = ({ article_id }, queries) => {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where({ article_id: article_id })
    .orderBy(queries.sort_by || "created_at", queries.order);
};

exports.selectArticles = queries => {
  const columns = [
    "article_id",
    "votes",
    "created_at",
    "author",
    "title",
    "topic",
    "comment_count"
  ];
  if (!columns.includes(queries.sort_by)) queries.sort_by = undefined;
  return connection
    .select(
      "articles.article_id",
      "articles.author",
      "articles.created_at",
      "articles.title",
      "articles.topic",
      "articles.votes"
    )
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "articles.article_id" })
    .orderBy(queries.sort_by || "created_at", queries.order)
    .modify(query => {
      if (queries.author) query.where({ "articles.author": queries.author });
      if (queries.topic) query.where({ topic: queries.topic });
    })
    .then(articles => {
      if (!articles.length)
        return Promise.reject({
          msg: "No results matching this query.",
          status: 404
        });
      else return articles;
    });
};
