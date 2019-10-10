const connection = require("../db/connection");
exports.selectTopics = () => {
  return connection.select().from("topics");
};

exports.selectTopic = slug => {
  if (!slug) return Promise.resolve([]);
  return connection
    .select()
    .from("topics")
    .where("slug", slug)
    .then(topic => {
      if (!topic.length)
        return Promise.reject({ msg: "No such topic found.", status: 404 });
      else return topic;
    });
};
