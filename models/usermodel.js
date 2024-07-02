const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
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
  role : {
    type : String,
    required : true,
    enum : {
        values : ['user','lead-guide','admin','guide'],
        message : 'role could be `user`,`lead-guide`,`admin` and `guide`'
    },
    default : 'user'
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return this.password == val;
      },
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  let bcryptedPassword = await bcrypt.hash(this.password, 12);
  this.password = bcryptedPassword;
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async (user, givenPassword) => {
  return await bcrypt.compare(givenPassword, user.password);
};

userSchema.methods.checkPasswordChangedAt = async (jwtTimeStamp) => {
  if (this.changedPasswordAt) {
    const changedTimeStamp = parseInt(this.changedPasswordAt / 1000, 10);
    return jwtTimeStamp < changedTimeStamp;
  }
  return false;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
