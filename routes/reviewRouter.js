const express = require("express");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });
//mergeParams helps in nested routes because each router have access 
//to its own routes but not any other routes. So, mergeParams can help
//us to borrow tourId from tourRouter and create a review.

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo(["user"]),
    reviewController.createReview
  )
  .get(
    authController.protect,
    authController.restrictTo(["user"]),
    reviewController.getAllReviews
  );

module.exports = router;
