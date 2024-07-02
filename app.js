const express = require("express");
const dotenv = require("dotenv");
const globalErrorHandler = require("./controllers/ErrorController");

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

app.use(globalErrorHandler);

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });

//   next();
// });

// app.all("*", (req, res, next) => {
//   let err = new Error();
//   err.statusCode = 400;
//   err.message = `The requested route is not available! ${req.originalUrl}`;

//   next(err);
// });

module.exports = app;
