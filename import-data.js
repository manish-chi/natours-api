const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("./models/tourModel");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,'utf-8'));

let DBConnection = process.env.DATABASE_CONNECTION.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

DBConnection = DBConnection.replace(
  "<USERNAME>",
  process.env.DATABASE_USERNAME
);

console.log(DBConnection);

mongoose
  .connect(DBConnection)
  .then((conn) => {
    console.log("connected sucessfully");
    console.log(conn);
  })
  .catch((err) => {
    console.log(err);
  });

let importData = async () => {
  try {
    await Tour.create(tours);
    console.log(`Tours have been added successfully!😊`);
  } catch (err) {
    console.log("Error Occured!");
  }
};

let deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(`Deleted All tours!`);
  } catch (err) {
    console.log("Error Occured!");
  }
};

if (process.argv[2] == "--import-data") {
  importData();
} else if (process.argv[2] == "--delete-data") {
  deleteData();
}
