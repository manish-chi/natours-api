const fs = require("fs");
const Tour = require("../models/tourModel");

exports.CheckID = async (req, res, next, value) => {
  // if (value > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }

  let tour = await Tour.findById(value);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  req.tour = tour;

  next();
};

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

exports.getAllTours = async (req, res) => {
  let queryObj = {};

  if (req.query) {
    queryObj = Object.assign({}, req.query);
  }

  let excludedlist = ["page", "sort", "fields", "limit"];

  excludedlist.forEach((element) => {
    delete queryObj[element];
  });

  console.log(queryObj);

  //Advanced Filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);

  let query = Tour.find(queryObj);
  //2)SORTING..
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  if (req.query.limit) {
    console.log(req.query.limit);
    query = query.limit(req.query.limit);
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");

    query = query.select(fields);
  }

  //pagination..

  let page = req.query.page || 1;
  let limit = req.query.limit || 100;
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  console.log(`queryString replaced! ${query}`);

  //Excecute Query
  let tours = await query;

  return res.status(200).json({
    results: tours.length,
    data: tours,
  });
};

exports.getTour = async (req, res) => {
  let tour = req.tour;

  return res.status(200).json({
    status: "success",
    data: tour,
  });
};

exports.createTour = async (req, res) => {
  try {
    let tour = req.body;
    tour = await Tour.create(tour);
    return res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: `Failed to create Tour ${err}`,
    });
  }
};

exports.updateTour = async (req, res) => {
  let tour = req.tour;

  tour = await Tour.findOneAndUpdate({ _id: tour._id }, req.body, {
    new: true,
  });
  return res.status(200).json({
    status: "success",
    message: "Tour have been updated",
    data: tour,
  });
};

exports.deleteTour = async (req, res) => {
  let tour = req.tour;
  await Tour.findOneAndDelete({ _id: tour._id });

  return res.status(200).json({
    status: "success",
    data: tour,
  });
};
