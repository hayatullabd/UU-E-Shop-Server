const mongoose = require("mongoose");
const validator = require("validator");

const MyShopSchema = mongoose.Schema(
  {
    logo: String,
    email: {
      type: String,
      trim: true,
      validate: [validator.isEmail, "please provide a valid email"],
      required: [true, "Email address is required"],
      unique: true,
    },
    shopName: {
      type: String,
      required: [true, "shopName is not empty"],
    },
    address: {
      type: String,
      required: [true, "address "],
    },

    phone: {
      type: String,
      required: [true, "phone is not empty"],
    },
    facebookPage: String,
    facebookGroup: String,
    Youtube: String,
    twitter: String,
    linkedin: String,
    aboutShop: String,
  },
  {
    timestamps: true,
  }
);

const MyShop = mongoose.model("MyShop", MyShopSchema);

module.exports = MyShop;
