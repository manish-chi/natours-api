const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

//router.param("id", tourController.CheckID);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

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
    authController.restrictTo(["user", "lead-guide", "guide","admin"]),
    tourController.deleteTour
  );

module.exports = router;
