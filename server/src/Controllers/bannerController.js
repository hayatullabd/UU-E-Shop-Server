const {
  getBannerService,
  createBannerService,
  getBannerByIdService,
  updateBannerByIdService,
  deleteBanner,
} = require("../services/bannerService");

exports.getBanner = async (req, res) => {
  try {
    let filters = { ...req.query };
    const excludesFields = ["limit", "page", "sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { childBanner: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipBanner = (page - 1) * +limit;
      queries.skip = skipBanner;
      queries.limit = +limit;
    }

    // single with multi sorting
    if (req.query.sort) {
      let sortCateory = req.query.sort;
      sortCateory = sortCateory.split(",").join(" ");
      queries.sort = sortCateory;
    }

    // for projection---------------------------------------------
    if (req.query.fields) {
      let selectBanner = req.query.fields.split(",").join(" ");
      queries.fields = selectBanner;
    }

    const result = await getBannerService(filters, queries);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const newBanner = await createBannerService(req.body);

    res.status(200).json({
      status: "success",
      message: "Banner Create successfully!",
      data: newBanner,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const id = req.params.id;
    const Banner = await getBannerByIdService(id);

    res.status(200).json({
      status: "success",
      data: Banner,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteBannerById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteBanner(id);

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateBannerById = async (req, res) => {
  try {
    const id = req.params.id;
    const Banner = await updateBannerByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      message: "banner updated",
      data: Banner,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
