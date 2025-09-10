const Coupons = require("../Models/couponsModel");

exports.getCouponsService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await Coupons.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await Coupons.countDocuments(filters);
  return { total, result };
};

exports.createCouponsService = async (data) => {
  const result = await Coupons.create(data);
  return result;
};

exports.getCouponsByIdService = async (id) => {
  const result = await Coupons.findById(id);
  return result;
};

exports.updateCouponsByIdService = async (id, data) => {
  const result = await Coupons.updateOne({ _id: id }, data);
  return result;
};
exports.deleteCoupons = async (id) => {
  const result = await Coupons.deleteOne({ _id: id });
  return result;
};
