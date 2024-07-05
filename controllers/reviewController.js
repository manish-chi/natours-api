const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
    //Allow nested routes /tour/qwrq3rqwerwer/reviews
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

  let review = await Review.create(req.body);
  return res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  let reviews = await Review.find();
  return res.status(200).json({
    status: "success",
    count: reviews.length,
    data: reviews,
  });
});
