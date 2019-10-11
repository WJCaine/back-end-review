const { selectEndpoints } = require("../models/apiModel");
const { endpoints } = require("../endpoints.json");

exports.sendEndpoints = (req, res, next) => {
  res.status(200).send(endpoints);
};
