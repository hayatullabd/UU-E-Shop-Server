const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      validate: [validator.isEmail, "please provide a valid email"],
      required: [true, "Email address is required"],
      unique: true,
    },

    phone: {
      type: String,
      trim: false,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 5,
            minLowercase: 0,
            minNumbers: 0,
            minUppercase: 0,
            minSymbols: 0,
          }),
        message: "password {VALUE} is not strong enough.",
      },
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords don't match!",
      },
    },
    fullName: {
      type: String,
      required: [true, "Please provide your Full Name"],
      trim: true,
    },
    address: String,
    imageURL: {
      type: String,
      // validate: [validator.isURL, "Please provide a valid image url"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "{VALUE} is invalid ",
      },
    },
    padding_wallet:{
      type:Number
    },
    wallet:{
      type:Number
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["user", "admin","staff"],
      default: "user",
    },
    forgetPasswordToken: {
      type: String,
      default: "",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const password = this.password;
  const hashedPassword = bcrypt.hashSync(password);
  this.password = hashedPassword;
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
