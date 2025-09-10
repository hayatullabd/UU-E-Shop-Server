const MyShop = require("../Models/myShopModel");

exports.getMyShopService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await MyShop.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await MyShop.countDocuments(filters);
  return { total, result };
};

exports.createMyShopService = async (data) => {
  const result = await MyShop.create(data);
  return result;
};

exports.getMyShopByIdService = async (id) => {
  const result = await MyShop.findById(id);
  return result;
};

exports.updateMyShopByIdService = async (id, data) => {
  const result = await MyShop.updateOne({ _id: id }, data);
  return result;
};
exports.deleteMyShop = async (id) => {
  const result = await MyShop.deleteOne({ _id: id });
  return result;
};
