const Brand = require("../Models/BrandModel");
const {
  getBrandService,
  createBrandService,
  getBrandByIdService,
  updateBrandByIdService,
  deleteBrand,
} = require("../services/BrandServices");

exports.getBrand = async (req, res) => {
  try {
    let filters = { ...req.query };
    const excludesFields = ["limit", "page", "sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          { parentBrand: { $regex: req.query.search, $options: "i" } },
          { childBrand: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipBrand = (page - 1) * +limit;
      queries.skip = skipBrand;
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
      let selectBrand = req.query.fields.split(",").join(" ");
      queries.fields = selectBrand;
    }
    /*   // for search---------------------------------
    if (req.query.search) {
      let serachQuery = req.query.search;
      queries.search = serachQuery;
    } */

    const result = await getBrandService(filters, queries);

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

exports.createBrand = async (req, res) => {
  try {
    const newBrand = await createBrandService(req.body);
    res.status(200).json({
      status: "success",
      message: "brand inserted successfully!",
      data: newBrand,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const id = req.params.id;
    const Brand = await getBrandByIdService(id);

    res.status(200).json({
      status: "success",
      data: Brand,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteBrandById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteBrand(id);

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

exports.updateBrandById = async (req, res) => {
  try {
    const id = req.params.id;
    const Brand = await updateBrandByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      data: Brand,
      message: "brand update done",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
