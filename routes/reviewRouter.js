const express = require("express");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });
//mergeParams helps in nested routes because each router have access
//to its own routes but not any other routes. So, mergeParams can help
//us to borrow tourId from tourRouter and create a review.

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .get(authController.restrictTo("user"), reviewController.getAllReviews);

router
  .route("/:id")
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
