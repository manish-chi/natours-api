const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

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

tourSchema.virtual("durationWeeks").get(function () {
  return parseFloat((this.duration / 7).toFixed(2));
});

tourSchema.pre("save", function (next) {
  //this is document object in pre. middle ware.
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post("save", (doc, next) => {
  console.log(doc);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: false } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, (doc, next) => {
  console.log(doc);
  next();
});

let Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
