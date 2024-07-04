const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
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
    ref: "users",
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "tours",
  },
});

reviewSchema.pre(/^find/,function(next) {
    this.populate({
        path : 'user',
        select : '-__v'
    }).populate({
        path : 'tour',
        select : 'name rating difficulty price'
    });
    
    next();
});

const reviews = mongoose.model("reviews", reviewSchema);

module.exports = reviews;
