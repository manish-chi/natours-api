const fs = require("fs");

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.CheckID = (req, res, next, value) => {
  if (value > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

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

exports.getAllTours = (req, res) => {
  return res.status(200).json({
    NumberOfTours: tours.length,
    data: tours,
  });
};

exports.getTour = (req, res) => {
  let { id } = req.params;
  id = id * 1;

  let tour = tours.find((ele) => ele.id == id);

  return res.status(200).json({
    status: "success",
    data: tour,
  });
};

exports.createTour = (req, res) => {
  let tour = req.body;
  let id = tours.length;
  tour = Object.assign(tour, { id: id });
  tours.push(tour);
  writeToFile(tours, tour, res);
};

exports.updateTour = (req, res) => {
  let { id } = req.params;
  id = id * 1;
  let tour = tours[id];

  let isPropValid = Object.keys(req.body).every((prop) =>
    tour.hasOwnProperty(prop)
  );

  if (isPropValid) {
    for (let property in req.body) {
      if (tour.hasOwnProperty(property)) {
        tour[property] = req.body[property];
      }
    }
    return res.status(200).json({
      status: "success",
      message: "Tour have been updated",
      data: tour,
    });
  } else {
    return res.status(500).json({
      status: "failed",
      message: "Sorry, couldn't find the given property!",
    });
  }
};

exports.deleteTour = (req, res) => {
  let id = req.params.id * 1;

  let tour = tours.filter((tour) => {
    return tour.id == id;
  });

  if (tour) {
    let updatedTours = tours.filter((tour) => {
      return tour.id != id;
    });
    writeToFile(updatedTours, tour, res);
  } else {
    return res.status(404).json({
      status: "failed",
      message: "Tour with ID not found!",
    });
  }
};
