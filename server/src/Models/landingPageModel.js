const mongoose = require("mongoose");

const LandingPageSchema = new mongoose.Schema(
  {
    title1: {
      type: String,
      required: [true, "Title 1 is required."],
    },
    title2: {
      type: String,
      required: [true, "Title 2 is required."],
    },
    YouTube: {
      type: String,
      required: [true, "YouTube link is required."],
    },
    shortDes: {
      type: String,
      required: [true, "Short description is required."],
    },
    products: {
      type: Array,
      required: [true, 'please add product on landing page']
    },
    galleryTitle: {
      type: String,
      required: [true, "Gallery title is required."],
    },
    galleryImages: {
      type: [String], // an array of strings
      required: true,
    },
    featureTitle: {
      type: String,
      required: [true, "Feature title is required."],
    },
    features: {
      type: String,
      required: [true, "Features description is required."],
    },
    packagePrice: {
      type: Number,
      required: [true, "packagePrice price is required."],
    },
    discount: Number, // discount is not required
  },
  { timestamps: true }
);

const LandingPage = mongoose.model("LandingPage", LandingPageSchema);

module.exports = LandingPage;
