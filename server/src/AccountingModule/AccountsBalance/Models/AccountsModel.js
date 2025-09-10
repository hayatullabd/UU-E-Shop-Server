const mongoose = require("mongoose");
const validator = require("validator");

const AccountsSchema = mongoose.Schema(
  {
    accountName: {
      type: String,
      required: [true, "Account name is required."],
      unique: [true, "Account Name must be unique"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
    },
    bgColor: {
      type: String,
      default: '#808080'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Accounts = mongoose.model("Accounts", AccountsSchema);

module.exports = Accounts;
