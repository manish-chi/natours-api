const User = require("../models/usermodel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  let token = signToken(user);

  return res.status(201).json({
    status: "success",
    data: token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError(400, "Missing email or password! try again"));
  }

  let user = await User.findOne({ email: email });

  if (!user) {
    next(new AppError(400, "User with email address not found! try again!"));
  }

  if (!user || !user.correctPassword(user, password)) {
    next(new AppError(403, "Password is incorrect! Please try again"));
  }

  req.user = user;

  let token = signToken(user);

  return res.status(201).json({
    status: "success",
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    next(new AppError(400, "Authorization headers are not provided!"));
  }

  let token = "";

  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  }

  let decoded = jwt.verify(token, process.env.JWT_SECRET);

  let currentUser = await User.findOne({ _id: decoded.id });

  if (!currentUser) {
    next(new AppError(401, "User belonging to this token no longer exists."));
  }

  if (!currentUser.checkPasswordChangedAt(decoded.iat)) {
    next(
      new AppError(401, "User recently changed password, Please login again")
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError(403, "You do not have permission to access this route")
      );
    }
    next();
  };
};

const signToken = (user) => {
  let id = user._id;
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
