const Order = require("../Models/orderModel");

exports.getOrderService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await Order.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await Order.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.createOrderService = async (data) => {
  const result = await Order.create(data);
  return result;
};

exports.getOrderByIdService = async (id) => {
  const result = await Order.findById(id)
    .populate("user")
    .populate(
      "orderItem.product",
      "name salePrice productPrice buyingPrice category"
    );

  return result;
};

exports.updateOrderByIdService = async (id, data) => {
  const result = await Order.updateOne({ _id: id }, data);
  return result;
};
exports.deleteOrder = async (id) => {
  const result = await Order.deleteOne({ _id: id });
  return result;
};
