const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router
  .route("/")
  .get(
    authController.restrictTo(["admin"]),
    userController.getUsers
  )
  .post(userController.createUser);

router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo(["admin"]),
    userController.deleteUser
  );

module.exports = router;
