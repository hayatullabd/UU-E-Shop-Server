const mongoose = require("mongoose");

const InvoiceNumberSchema = new mongoose.Schema(
  {
    invoiceNumber: Number,
  },
  { timestamps: true }
);
const InvoiceNumber = mongoose.model("InvoiceNumber", InvoiceNumberSchema);

module.exports = InvoiceNumber;
