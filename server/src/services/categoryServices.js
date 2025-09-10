const Category = require("../Models/CategoryModel");

exports.getCategoryService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await Category.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await Category.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.createCategoryService = async (data) => {
  const result = await Category.create(data);
  return result;
};

exports.getCategoryByIdService = async (id) => {
  const result = await Category.findById(id);
  return result;
};

exports.updateCategoryByIdService = async (id, data) => {
  const result = await Category.updateOne({ _id: id }, data);
  return result;
};
exports.deleteCategory = async (id) => {
  const result = await Category.deleteOne({ _id: id });
  return result;
};
