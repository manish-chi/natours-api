const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("./models/tourModel");
const User = require("./models/usermodel");
const Review = require("./models/reviewModel");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, "utf-8")
);

let users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, "utf-8")
);

let reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, "utf-8")
);

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
    await User.create(users);
    await Review.create(reviews);
    console.log(`data have been added successfully!😊`);
  } catch (err) {
    console.log("Error Occured!");
  }
};

let deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log(`Deleted All data!`);
  } catch (err) {
    console.log("Error Occured!");
  }
};

if (process.argv[2] == "--import-data") {
  importData();
} else if (process.argv[2] == "--delete-data") {
  deleteData();
}
