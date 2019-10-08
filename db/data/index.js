const ENV = process.env.NODE_ENV || "development";

const dev_data = require("./development-data");
const test_data = require("./test-data");

const data = {
  development: dev_data,
  test: test_data
};

module.exports = data[ENV];