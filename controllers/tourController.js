const fs = require("fs");
const Tour = require("../models/tourModel");
const AppFeatures = require("../utils/appFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");

// exports.CheckID = catchAsync(async (req, res, next, value) => {
//   console.log(value);
//   let tour = await Tour.findById(value);

//   if (!tour) {
//     next(new AppError(404, "Invalid Id!"));
//   } else {
//     req.tour = tour;
//     next();
//   }
// });

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "name and price must be present",
    });
  }

  next();
};

function writeToFile(tours, tour, res) {
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: "Failed to modify tours-simple.json",
        });
      } else {
        return res.status(200).json({
          status: "success",
          data: tour,
        });
      }
    }
  );
}

exports.getAllTours = handlerFactory.getAll(Tour);

exports.getTour = handlerFactory.getOne(Tour, "reviews");

exports.createTour = handlerFactory.createOne(Tour);

exports.updateTour = handlerFactory.updateOne(Tour);

exports.deleteTour = handlerFactory.deleteOne(Tour);
