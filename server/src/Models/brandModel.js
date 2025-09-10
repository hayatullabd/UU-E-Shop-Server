const mongoose = require("mongoose");
const validator = require("validator");

const BrandSchema =new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    image: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;
