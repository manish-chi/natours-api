const fs = require("fs");
const Tour = require("../models/tourModel");
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

exports.getAllTours = handlerFactory.getAll(Tour);

exports.getTour = handlerFactory.getOne(Tour, "reviews");

exports.createTour = handlerFactory.createOne(Tour);

exports.updateTour = handlerFactory.updateOne(Tour);

exports.deleteTour = handlerFactory.deleteOne(Tour);
