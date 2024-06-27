const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const { profileEnd } = require("console");
const app = express();

app.use(express.json());

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  return res.status(200).json({
    NumberOfTours: tours.length,
    data: tours,
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  let { id } = req.params;
  id = id * 1;
  if (id >= tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Tour with given ID not found!",
    });
  } else {
    let tour = tours.find((ele) => ele.id == id);
    console.log(tour);
    return res.status(200).json({
      status: "success",
      data: tour,
    });
  }
});

app.post("/api/v1/tours", (req, res) => {
  let tour = req.body;
  let id = tours.length;
  tour = Object.assign(tour, { id: id });
  tours.push(tour);
  writeToFile(tours, tour, res);
});

app.patch("/api/v1/tours/:id", (req, res) => {
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
});

app.delete("/api/v1/tours/:id", (req, res) => {
  let id = req.params.id * 1;
  let tourToDelete = tours[id];
  if (tours.includes()) {
    let updatedTours = tours.filter((tour) => {
      return tour.id != tourToDelete.id;
    });
    writeToFile(updatedTours, tourToDelete, res);
  } else {
    return res.status(404).json({
      status: "failed",
      message: "Tour with ID not found!",
    });
  }
});

function writeToFile(tours, tour, res) {
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

let port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port number: ${port}`);
});
