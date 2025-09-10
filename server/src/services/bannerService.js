const Banner = require("../Models/bannerModel");

exports.getBannerService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await Banner.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await Banner.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.createBannerService = async (data) => {
  const result = await Banner.create(data);
  return result;
};

exports.getBannerByIdService = async (id) => {
  const result = await Banner.findById(id);

  return result;
};

exports.updateBannerByIdService = async (id, data) => {
  const result = await Banner.updateOne({ _id: id }, data);
  return result;
};
exports.deleteBanner = async (id) => {
  const result = await Banner.deleteOne({ _id: id });
  return result;
};
