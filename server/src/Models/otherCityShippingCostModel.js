const mongoose = require("mongoose");

const OtherCityShippingCostSchema = new mongoose.Schema(
  { otherCityCost: Number },
  { timestamps: true }
);
const OtherCityShippingCost = mongoose.model(
  "OtherCityShippingCost",
  OtherCityShippingCostSchema
);

module.exports = OtherCityShippingCost;
