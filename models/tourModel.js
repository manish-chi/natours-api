const mongoose = require("mongoose");

let tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "a tour must have name."],
    },
    duration: {
      type: Number,
      required: [true, "duration is number"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "a group must have group size"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"],
    },
    price: {
      type: Number,
      required: [true, "a tour must have price"],
    },
    priceDiscount: Number,
    ratings: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      //select: false,
    },
    summary: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    startDates: [Array],
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toObject: { virtuals: true },
    toJson: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

let Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
