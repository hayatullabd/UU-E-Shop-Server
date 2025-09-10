const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  inDhaka: Number,
  outDhaka: Number,
  others: Number,
});

const DeliveryCost = mongoose.model("DeliveryCost", DeliverySchema);

module.exports = DeliveryCost;
