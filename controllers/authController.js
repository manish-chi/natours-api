const User = require("../models/usermodel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");
const crypto = require("crypto");


const createSendToken = (user, statusCode, res) => {
  let id = user._id;
  let token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.passwordChangedAt = undefined;

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  return createSendToken(user, 201, res);
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

  return createSendToken(user, 200, res);
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
      new AppError(401, "User recently changed password, Please login again.")
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError(403, "You do not have permission to access this route")
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. get user on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email address", 404));
  }
  //2. generate random token
  const resetToken = await user.createPasswordResetToken();
  user.markModified("passwordResetToken");
  user.markModified("passwordResetExpires");
  await user.save({ validateBeforeSave: false });
  //3. send mail
  const URL = `Please send PATCH request to http://${req.hostname}/api/v1/users/resetPassword/${resetToken}.If you have not send the request, please ignore.`;

  let options = {
    email: user.email,
    subject: "Your password reset token (valid for 10 min)",
    message: URL,
  };

  try {
    await sendMail(options);
    return res.status(200).json({
      status: "success",
      message: "Token has been sent to mail",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "failed",
      message: "There was some problem in sending mail to the user",
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  let resetToken = req.params.token;
  console.log(resetToken);
  let passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  let user = await User.findOne({
    passwordResetToken: passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    next(new AppError("Token with this user has been expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Your password has been successfully reset!",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError(404, "User is not found with required Id"));
  }

  if (!user.correctPassword(user, req.body.currentPassword)) {
    next(
      new AppError(403, "Password is incorrect! Please provide valid password")
    );
  }

  user.password = user.password;
  user.passwordConfirm = user.passwordConfirm;
  user.passwordChangedAt = Date.now();

  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: "success",
    message: "password updated!",
  });
});
