const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this product."],
      minLength: [2, "Name must be at least 2 characters."],
      maxLength: [100, "Name is too large"],
    },
    sku: {
      type: String,
      minLength: [3, "Sku must be at least 3 characters."],
      maxLength: [100, "Sku is too large"],
    },
    path: {
      type: String,
      required: [false, "Please provide a path for this product."],
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: [String],
      required: false,
    },
    productType: {
      type: String,
      required: false,
    },
    productColor: {
      type: [String],
      required: false,
    },
    saleCount: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be at least 0"],
      max: [10000, "Quantity is too large"],
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
      required: true,
      min: [0, "Discount must be at least 0"],
      max: [100, "Discount is too large"],
    },
    brand: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
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
    youtube: {
      type: String,
    },
    size: {
      type: [String],
      required: false,
    },
    rating: {
      type: Number,
      default: 0
    },
    variant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
    review:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      }
    ],
    ratingValue: Number,
    status: {
      type: Boolean,
      required: [false, "Please select product publish or review."],
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
