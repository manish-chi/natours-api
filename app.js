const express = require("express");
const dotenv = require("dotenv");

const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

dotenv.config({ path: "./config.env" });

let app = express();
app.use(express.json());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}


app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

module.exports = app;
