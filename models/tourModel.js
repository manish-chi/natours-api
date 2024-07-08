const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("../models/usermodel");
//const Review = require("../models/reviewModel");

let tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
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
      enum: {
        values: ["easy", "difficult", "medium"],
        message: "The difficulty can be easy,medium or difficult.",
      },
    },
    price: {
      type: Number,
      required: [true, "a tour must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
      },
    },
    slug: String,
    ratings: {
      type: Number,
      default: 4.5,
      min: [1, "minmum rating is 1"],
      max: [5, "maxium rating is 5"],
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
    secretTour: {
      type: Boolean,
      default: false,
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
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    //reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

//tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual("durationWeeks").get(function () {
  return parseFloat((this.duration / 7).toFixed(2));
});

//virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre("save", function (next) {
  //this is document object in pre. middle ware.
  this.slug = slugify(this.name, { lower: true });
  next();
});

//This is embedding of guides. You can mention guides as Array in Tour Model and embeed.
// tourSchema.pre("save", async function (next) {
//   let guideQueries = this.guides.map((id) => User.findById(id));
//   this.guides = await Promise.all(guideQueries);
//   console.log(this.guides);
//   next();
// });

//populate child references...
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  });
  // .populate({
  //   path: "reviews",
  //   select: "-__v",
  // });
  next();
});

tourSchema.post("save", (doc, next) => {
  console.log(doc);
  next();
});

tourSchema.pre(/^find/, function (next) {
  //this.find({ secretTour: { $ne: false } });
  //this.start = Date.now();
  next();
});

tourSchema.post(/^find/, (doc, next) => {
  console.log(doc);
  next();
});

let Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
