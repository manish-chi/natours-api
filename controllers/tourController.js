const fs = require("fs");
const Tour = require("../models/tourModel");
const AppFeatures = require("../utils/appFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

exports.getAllTours = catchAsync(async (req, res) => {
  const appFeatures = new AppFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  //Excecute Query
  let tours = await appFeatures.query;

  return res.status(200).json({
    results: tours.length,
    data: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //const id = new mongoose.Types.ObjectId(req.params.id);

  let tour = await Tour.findById(req.params.id);
  console.log("This is the tour data:" + tour);

  if (!tour) {
    return next(new AppError(404, "Invalid Id!"));
  }
  res.status(200).json({
    status: "success",
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res) => {
  let tour = req.body;
  tour = await Tour.create(tour);
  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.updateTour = async (req, res, next) => {
  let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(404, "No Document with given ID found!"));
  }

  return res.status(200).json({
    status: "success",
    message: "Tour have been updated",
    data: tour,
  });
};

exports.deleteTour = async (req, res) => {
  let tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(404, "no valid ID formed!"));
  }

  return res.status(200).json({
    status: "success",
    data: tour,
  });
};
