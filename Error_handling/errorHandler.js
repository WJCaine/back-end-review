exports.consoleLogEverything = (err, req, res, next) => {
  console.log(err);
  next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input syntax in request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "No such article found" });
  } else next(err);
};

exports.unhandledErrorWarning = (err, req, res, next) => {
  res.status(500).send({
    msg: "Unhandled error! Take a long hard look at what you've done."
  });
};

exports.send405 = (req, res, next) => {
  res.sendStatus(405);
};
