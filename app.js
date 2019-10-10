const express = require("express");
const {
  consoleLogEverything,
  handleCustomErrors,
  handlePsqlErrors
} = require("./Error_handling/errorHandler");
const apiRouter = require("./routes/apiRouter.js");
const app = express();
app.use(express.json());
app.use("/api", apiRouter);
app.use("/*", (req, res, next) => {
  next({ msg: "the requested URL was not found on this server", status: 404 });
});
// app.use(consoleLogEverything);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);

module.exports = app;
