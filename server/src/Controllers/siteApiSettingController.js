const SiteApiSetting = require("../Models/siteApiSettingModel");


// this api get data with secaret code with post method and response back only fb pixel
exports.getSiteApiSettingByPostMetodWithSecreateCode = async (req, res) => {
  try {
    const secrateCode = req.body.secrateCode;
    if (secrateCode !== "55@88") {
      return res.status(200).json({
        status: "success",
        message: 'your secrate code is wrong'
      })
    }
    const SiteApiSettingData = await SiteApiSetting.findOne({}, 'fbPixelId');

    res.status(200).json({
      status: "success",
      message: 'here only fb pixel id',
      data: SiteApiSettingData,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

// its api response back get only one data from site api , fbPixel, qurieer data and update data after udate then get 
exports.updateSiteApiSetting = async (req, res) => {
  try {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const SiteApiSettingData = await SiteApiSetting.findOneAndUpdate(
      {},
      { $set: req.body },
      options
    );

    res.status(200).json({
      status: "success",
      message: "Shop Details Updated",
      data: SiteApiSettingData,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
