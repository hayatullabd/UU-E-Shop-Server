const mongoose = require("mongoose");
const validator = require("validator");

const OrderSchema = new mongoose.Schema(
  {
    orderItem: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        originalProductPrice: {
          type: Number,
          required: true,
        },
        imageURL: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: false,
        },
        color: {
          type: String,
          required: false,
        },
        category: {
          type: String,
          required: false,
        },
      },
    ],
    invoiceNumber: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    walletAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    useWallet: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    afterDiscountPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    originalProductPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    couponDiscount: {
      type: Number,
      required: false,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered","hold", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentDetails: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
