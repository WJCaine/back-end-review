
exports.up = function (knex) {
  return knex.schema.createTable('users', userTable => {
    userTable.string('username').primary();
    userTable.string('name');
    userTable.string('avatar_url');
  })

};

exports.down = function (knex) {
  return knex.schema.dropTable('users')
};
