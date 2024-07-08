const express = require("express");
const dotenv = require("dotenv");
const globalErrorHandler = require("./controllers/ErrorController");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRouter");

dotenv.config({ path: "./config.env" });

let app = express();

app.use(helmet());

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
      "sort",
    ],
  })
);

app.use(compression());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`));

const limiter = rateLimiter({
  min: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too many request from this IP. Please try again later.",
});

app.use("/api/", limiter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/reviews", reviewRouter);

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
