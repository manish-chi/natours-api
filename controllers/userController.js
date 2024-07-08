const User = require("../models/usermodel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");

let filterBody = (req, ...allowedFields) => {
  let newUser = {};
  allowedFields.forEach((field) => {
    if (Object.keys(req.user).includes(field)) {
      newUser[field] = req[field];
    }
  });
  return newUser;
};

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (!req.user.name || !req.user.email) {
    next(new AppError(401, "Please provide name and email address correctly"));
  }

  let newUser = filterBody(req, ["name", "email"]);
  await User.findOneAndUpdate({ _id: req.user._id }, newUser, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    message: "user has been updated!",
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(200).json({
    status: "success",
    message: "user has been deleted!",
  });
});

exports.getAllUsers = handlerFactory.getAll(User, "name email");

exports.createUser = handlerFactory.createOne(User);

exports.getUser = handlerFactory.getOne(User);

exports.updateUser = handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);
