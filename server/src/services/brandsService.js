const Brands = require("../Models/brandsModel");

exports.getBrandsService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await Brands.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await Brands.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.createBrandsService = async (data) => {
  const result = await Brands.create(data);
  return result;
};

exports.getBrandsByIdService = async (id) => {
  const result = await Brands.findById(id);

  return result;
};

exports.updateBrandsByIdService = async (id, data) => {
  const result = await Brands.updateOne({ _id: id }, data);
  return result;
};
exports.deleteBrands = async (id) => {
  const result = await Brands.deleteOne({ _id: id });
  return result;
};
