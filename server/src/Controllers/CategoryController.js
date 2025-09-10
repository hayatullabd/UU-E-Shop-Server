const Category = require("../Models/CategoryModel");
const {
  getCategoryService,
  createCategoryService,
  getCategoryByIdService,
  updateCategoryByIdService,
  deleteCategory,
} = require("../services/categoryServices");

exports.getCategory = async (req, res) => {
  try {
    
    let filters = { ...req.query };
    const excludesFields = ["limit", "page", "sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          { parentCategory: { $regex: req.query.search, $options: "i" } },
          { childCategory: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipCategory = (page - 1) * +limit;
      queries.skip = skipCategory;
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
      let selectCategory = req.query.fields.split(",").join(" ");
      queries.fields = selectCategory;
    }
    /*   // for search---------------------------------
    if (req.query.search) {
      let serachQuery = req.query.search;
      queries.search = serachQuery;
    } */

    const result = await getCategoryService(filters, queries);

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
exports.getCategoryAndSubCategory = async (req, res) => {
  try {
    console.log("from category and subcateogry", req.query)

    const categories = await Category.find({ status: true });
    // childCategory:[name,name]
    // parentCategory:
    const box = [];
    const categoriesAndSubCategories = await categories.forEach((item) => {
      const x = item.parentCategory;
      box.push(x);
      if (item.childCategory.length > 0) {
        item.childCategory.forEach((child) => box.push(child));
      }
    });
    res.status(200).json({
      status: "success",
      data: box,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};
exports.getChildCategory = async (req, res) => {
  try {
    const documents = await Category.find({}, "childCategory parentCategory");
    const childCategories = documents.reduce(
      (acc, cur) => [...acc, ...cur.childCategory],
      []
    );
    const parentCategories = documents.map((cat) => cat.parentCategory);
    res.status(200).json({
      status: "success",
      message: "parent & child categories",
      data: { childCategories, parentCategories },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await createCategoryService(req.body);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await getCategoryByIdService(id);

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteCategory(id);

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

exports.updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await updateCategoryByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
