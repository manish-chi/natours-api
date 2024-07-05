const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
//router.param("id", tourController.CheckID);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrictTo(["user"]),
    reviewController.createReview
  );

router
  .route("/:id")
  .get(authController.protect, tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo(["user"]),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo(["user", "lead-guide", "guide", "admin"]),
    tourController.deleteTour
  );

//nested routes
// tours/qw3rqwrwer/reviews
// tours/a;sdlkjas;fkl/reviews/qwr213234213

module.exports = router;
