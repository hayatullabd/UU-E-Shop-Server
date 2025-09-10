const mongoose = require("mongoose");
const validator = require("validator");

const WalletSchema = mongoose.Schema(
  {
    walletName: {
      type: String,
      required: [true, "campName is not empty"],
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "discountPercentage is not empty"],
    },
    minAmount: {
      type: Number,
      required: [true, "minAmount is not empty"],
    },
    maxAmount: {
        type: Number,
        required: [true, "maxAmount is not empty"],
      },
    underOfCategory: {
      type: String,
      required: [true, "underOfCategory is not empty"],
    },
    imageURL: {
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
        message: "Provide a valid image URL",
      },
    },
    show: {
      type: String,
      enum: ["on", "off"],
      default: "on",
    },
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

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
