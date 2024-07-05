const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRouter");
//router.param("id", tourController.CheckID);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo(["admin", "lead-guide"]),
    tourController.checkBody,
    tourController.createTour
  );

// router
//   .route("/:tourId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo(["user"]),
//     reviewController.createReview
//   );

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/:id")
  .get(authController.protect, tourController.getTour)
  .patch(
    authController.protect,
    authController.protect,
    authController.restrictTo(["admin", "lead-guide"]),
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
