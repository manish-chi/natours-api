const mongoose = require("mongoose");
const validator = require("validator");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailRegex, "Please enter a valid email address."],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    min: [5, "password must be min. 5 characters."],
    max: [19, "password can be max. 19 characters"],
  },
  passwordConfirm: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
});

const User = new mongoose.model('User',userSchema);

module.exports = User;
