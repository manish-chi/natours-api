const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes /tour/qwrq3rqwerwer/reviews
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createReview = handlerFactory.createOne(Review);

exports.getAllReviews = handlerFactory.getAll(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
