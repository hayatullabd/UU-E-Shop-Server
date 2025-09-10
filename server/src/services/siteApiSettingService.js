const SiteApiSetting = require("../Models/siteApiSettingModel");

exports.getSiteApiSettingService = async (filters, queries) => {
  //   let searchQuery = new RegExp(queries.search);

  const result = await SiteApiSetting.find(filters)
    .select(queries.fields)
    .sort(queries.sort);
  const total = await SiteApiSetting.countDocuments(filters);
  return { total, result };
};

exports.createSiteApiSettingService = async (data) => {
  const result = await SiteApiSetting.create(data);
  return result;
};

exports.getSiteApiSettingByIdService = async (id) => {
  const result = await SiteApiSetting.findById(id);
  return result;
};

exports.updateSiteApiSettingByIdService = async (id, data) => {
  const result = await SiteApiSetting.updateOne({ _id: id }, data);
  return result;
};
exports.deleteSiteApiSetting = async (id) => {
  const result = await SiteApiSetting.deleteOne({ _id: id });
  return result;
};
