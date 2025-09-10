const mongoose = require("mongoose");
const validator = require("validator");

const VariantSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    imageURLs: {
      type: [String],
      validate: {
        validator: (value) => {
          if (!value || !Array.isArray(value)) {
            return false;
          }
          let allOk = true;
          value.forEach((v) => {
            console.log(validator.isURL(v));
            if (!validator.isURL(v)) {
              allOk = false;
            }
          });
          return allOk;
        },
        message: "Provide a valid image URL.",
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be at least 0"],
      max: [1000, "Quantity is too large"],
    },
    buyingPrice: {
      type: Number,
      required: true,
      min: [1, "Buying price must be at least 1"],
      max: [100000, "Buying price is too large"],
    },
    productPrice: {
      type: Number,
      required: true,
      min: [1, "Product price must be at least 1"],
      max: [100000, "Product price is too large."],
    },
    salePrice: {
      type: Number,
      required: true,
      min: [1, "Product sale price must be at least 1"],
      max: [100000, "Product sale price is too large"],
    },
    discount: {
      type: Number,
      required: false,
      min: [0, "Discount must be at least 0"],
      max: [100, "Discount is too large"],
    },
    productColor: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
const Variant = mongoose.model("Variant", VariantSchema);

module.exports = Variant;
