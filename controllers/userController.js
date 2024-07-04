const User = require("../models/usermodel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

let filterBody = (req, ...allowedFields) => {
  let newUser = {};
  allowedFields.forEach((field) => {
    if (Object.keys(req.user).includes(field)) {
      newUser[field] = req[field];
    }
  });
  return newUser;
};

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

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  return res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) throw new AppError(404, "User ID is invalid!");

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError(404, "User ID is invalid!");

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  let user = await User.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    message: "user is deleted!",
    data: {
      user,
    },
  });
});
