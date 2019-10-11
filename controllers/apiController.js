const { selectEndpoints } = require("../models/apiModel");

exports.sendEndpoints = (req, res, next) => {
  res.sendFile("../endpoints.json");
};
