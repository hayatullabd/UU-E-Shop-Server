const LandingPage = require("../Models/landingPageModel");

exports.getLandingPageService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await LandingPage.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await LandingPage.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, result };
};

exports.createLandingPageService = async (data) => {
  const result = await LandingPage.create(data);
  return result;
};

exports.getLandingPageByIdService = async (id) => {
  const result = await LandingPage.findById(id);

  return result;
};

exports.updateLandingPageByIdService = async (id, data) => {
  const result = await LandingPage.updateOne({ _id: id }, data);
  return result;
};
exports.deleteLandingPage = async (id) => {
  const result = await LandingPage.deleteOne({ _id: id });
  return result;
};
