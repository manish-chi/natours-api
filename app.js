const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const app = express();

app.use(express.json());

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  return res.status(200).json(tours);
});

app.post("/api/v1/tours", (req, res) => {
  let tour = req.body;
  let id = tours.length;
  tour = Object.assign(tour, { id: id });
  tours.push(tour);

  try {
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.js`, tours);

    return res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Failed to add tour to tours-simple.js",
    });
  }
});

let port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port number: ${port}`);
});
