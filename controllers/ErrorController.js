const AppError = require("../utils/appError");

const sendDevError = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = function (err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      statusCode: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: "Error Occured! Unknown Issue",
    });
  }
};

const handleCastErrorDB = (err) => {
  let message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateField = (err) => {
  let message = `Duplicate field with ${err.keyValue.name} cannot be created!`;
  return new AppError(400, message);
};

const handleValidationError = (err) => {
  let message = `${err.message}`;
  return new AppError(400, message);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log("hello....");

  if (process.env.NODE_ENV == "development") {
    console.log("this is error in development");
    sendDevError(err, res);
  } else if (process.env.NODE_ENV == "production") {
    if (err.name == "CastError") {
      console.log("hello....in caste error");
      err = handleCastErrorDB(err);
    } else if (err.code == 11000) {
      err = handleDuplicateField(err);
    } else if (err.name == "ValidationError") {
      err = handleValidationError(err);
    }
    sendProdError(err, res);
  }
};
