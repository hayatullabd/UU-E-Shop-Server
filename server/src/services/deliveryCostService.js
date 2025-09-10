const DeliveryCost = require("../Models/deliveryModel");

exports.createDeliveryCostService = async (data) => {
  const result = await DeliveryCost.create(data);
  return result;
};
// -------------------

exports.getDeliveryCostService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await DeliveryCost.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await DeliveryCost.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.getDeliveryCostByIdService = async (id) => {
  const result = await DeliveryCost.findById(id);

  return result;
};

exports.updateDeliveryCostByIdService = async (id, data) => {
  const result = await DeliveryCost.updateOne({ _id: id }, data);
  return result;
};
exports.deleteDeliveryCost = async (id) => {
  const result = await DeliveryCost.deleteOne({ _id: id });
  return result;
};
