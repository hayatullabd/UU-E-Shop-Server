const {
  getBrandsService,
  createBrandsService,
  getBrandsByIdService,
  updateBrandsByIdService,
  deleteBrands,
} = require("../services/brandsService");

exports.getBrands = async (req, res) => {
  try {
    let filters = { ...req.query };
    const excludesFields = ["limit", "page", "sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipBrands = (page - 1) * +limit;
      queries.skip = skipBrands;
      queries.limit = +limit;
    }

    // single with multi sorting
    if (req.query.sort) {
      let sortBrands = req.query.sort;
      sortBrands = sortBrands.split(",").join(" ");
      queries.sort = sortBrands;
    }

    // for projection---------------------------------------------
    if (req.query.fields) {
      let selectBrands = req.query.fields.split(",").join(" ");
      queries.fields = selectBrands;
    }

    const result = await getBrandsService(filters, queries);

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

exports.createBrands = async (req, res) => {
  try {
    const newBrands = await createBrandsService(req.body);

    res.status(200).json({
      status: "success",
      message: "Add Brand successfully!",
      data: newBrands,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getBrandsById = async (req, res) => {
  try {
    const id = req.params.id;
    const Brands = await getBrandsByIdService(id);

    res.status(200).json({
      status: "success",
      data: Brands,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteBrandsById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteBrands(id);

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

exports.updateBrandsById = async (req, res) => {
  try {
    const id = req.params.id;
    const Brands = await updateBrandsByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      message: "Brands updated",
      data: Brands,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
