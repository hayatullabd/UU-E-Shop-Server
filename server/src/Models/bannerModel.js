const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "banner title not empty"],
    },
    image: String,
    position: {
      type: String,
      default: "0",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);
const Banner = mongoose.model("BannerSchema", BannerSchema);

module.exports = Banner;
