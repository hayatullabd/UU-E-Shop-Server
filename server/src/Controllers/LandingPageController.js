const {
  getLandingPageService,
  createLandingPageService,
  getLandingPageByIdService,
  updateLandingPageByIdService,
  deleteLandingPage,
} = require("../services/LandingPageService");

exports.getLandingPage = async (req, res) => {
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
          { childLandingPage: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipLandingPage = (page - 1) * +limit;
      queries.skip = skipLandingPage;
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
      let selectLandingPage = req.query.fields.split(",").join(" ");
      queries.fields = selectLandingPage;
    }

    const result = await getLandingPageService(filters, queries);

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

exports.createLandingPage = async (req, res) => {
  try {
    const newLandingPage = await createLandingPageService(req.body);

    res.status(200).json({
      status: "success",
      message: "Landing Page Add successfully!",
      data: newLandingPage,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getLandingPageById = async (req, res) => {
  try {
    const id = req.params.id;
    const LandingPage = await getLandingPageByIdService(id);

    res.status(200).json({
      status: "success",
      data: LandingPage,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteLandingPageById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteLandingPage(id);

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

exports.updateLandingPageById = async (req, res) => {
  try {
    const id = req.params.id;
    const LandingPage = await updateLandingPageByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      message: "LandingPage updated",
      data: LandingPage,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
