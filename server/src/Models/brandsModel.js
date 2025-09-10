const mongoose = require("mongoose");

const BrandsSchema = new mongoose.Schema(
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
  { timestamps: true }
);
const Brands = mongoose.model("Brands", BrandsSchema);

module.exports = Brands;
