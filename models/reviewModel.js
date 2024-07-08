const mongoose = require("mongoose");
const Tour = require("../models/tourModel");

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "a review should be given by user for tour"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "a review is must for tour"],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v",
  });
  //   populate({
  //     path: "tour",
  //     select: "-guides name rating difficulty price ",
  //   });

  next();
});

reviewSchema.statics.calculateRatingsAverage = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        ratingsAverage: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].ratingsAverage,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateRatingsAverage(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.oldDoc = await this.clone().findOne();
  console.log(this);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  this.oldDoc.constructor.calculateRatingsAverage(this.oldDoc.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
