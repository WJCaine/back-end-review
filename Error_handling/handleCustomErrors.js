exports.consoleLogEverything = (err, req, res, next) => {
  console.log(err)
  next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg })
  }
  else next(err)
}


exports.handleBadURL = (err, req, res, next) => {

}