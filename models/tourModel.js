const mongoose = require("mongoose");

let tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a tour must have name."],
    },
    duration: {
      type: Number,
      required: [true, "duration is number"],
    },
    maxGroupSize: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"],
    },
    price: {
      type: Number,
      required: [true, "a tour must have price"],
    },
    ratings: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
    },
    summary: {
      type: String,
    },
    imageCover: {
      type: String,
    },
    images: {
      type: [],
    },
    startDates: {
      type: [],
    },
  },
  { skipInvalid: false }
);

let Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
