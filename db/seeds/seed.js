const ENV = process.env.NODE_ENV || 'development'
const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index');


const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function (knex) {
  return knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);

      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {

          dateFormattedArticleData = formatDates(articleData);
          return knex('articles').insert(dateFormattedArticleData).returning('*');
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows, 'title', 'article_id');
          const formattedComments = formatComments(commentData, articleRef);
          return knex('comments').insert(formattedComments);
        });


    })


};
