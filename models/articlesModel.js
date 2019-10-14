const connection = require("../db/connection");
const { selectTopic } = require("./topicsModel");
const { selectUser } = require("./usersModel");

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
  if (!body.username || !body.body)
    return Promise.reject({
      msg: "Invalid input syntax in request",
      status: 400
    });
  return connection("comments")
    .insert(
      { author: body.username, body: body.body, article_id: article_id },
      ["*"]
    )
    .then(comment => comment[0]);
};

exports.selectArticleComments = ({ article_id }, queries) => {
  const columns = ["comment_id", "votes", "created_at", "author", "body"];
  const { selectArticle } = exports;
  if (!columns.includes(queries.sort_by)) queries.sort_by = "created_at";
  if (queries.order !== "asc" && queries.order !== "desc")
    queries.order = "desc";
  const commentsRequest = connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where({ article_id: article_id })
    .orderBy(queries.sort_by || "created_at", queries.order);

  return Promise.all([commentsRequest, selectArticle, article_id]).then(
    ([comments, selectArticle, article_id]) => {
      if (!comments.length) {
        return selectArticle({ article_id }).then(() => {
          return [];
        });
      } else return comments;
    }
  );
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
  if (!columns.includes(queries.sort_by)) queries.sort_by = "created_at";
  if (!queries.limit) queries.limit = 10;
  if (!queries.order || (queries.order !== "asc" && queries.order !== "desc"))
    queries.order = "desc";

  if (!queries.p) queries.p = 1;
  const articlesQuery = connection
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
    .orderBy(queries.sort_by, queries.order)
    .limit(queries.limit)
    .offset(queries.limit * (queries.p - 1))
    .modify(query => {
      if (queries.author) query.where({ "articles.author": queries.author });
      if (queries.topic) query.where({ topic: queries.topic });
    });
  return Promise.all([articlesQuery, queries]).then(([articles, queries]) => {
    if (!articles.length) {
      return Promise.all([
        selectTopic(queries.topic),
        selectUser({ username: queries.author })
      ]).then(() => []);
    } else return articles;
  });
};
