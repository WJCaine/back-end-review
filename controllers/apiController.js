const { selectEndpoints } = require("../models/apiModel");
const endpoints = require("../endpoints.json");
console.log(endpoints);
exports.sendEndpoints = (req, res, next) => {
  res.status(200).json(endpoints);
};
