const Brand = require("../Models/BrandModel");

exports.getBrandService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await Brand.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await Brand.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.createBrandService = async (data) => {
  const result = await Brand.create(data);
  return result;
};

exports.getBrandByIdService = async (id) => {
  const result = await Brand.findById(id);
  return result;
};

exports.updateBrandByIdService = async (id, data) => {
  const result = await Brand.updateOne({ _id: id }, data);
  return result;
};
exports.deleteBrand = async (id) => {
  const result = await Brand.deleteOne({ _id: id });
  return result;
};
