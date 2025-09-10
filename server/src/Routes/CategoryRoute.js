const express = require("express");
const {
  getCategory,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoryAndSubCategory,
  getChildCategory,
} = require("../Controllers/CategoryController");
const adminVerify = require("../middlewere/adminVerify");

const router = express.Router();

router.route("/").get(getCategory).post(adminVerify, createCategory);
router.route("/category-and-subcategory").get(getCategoryAndSubCategory)
router.route("/childCategory").get(getChildCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .delete(adminVerify, deleteCategoryById)
  .patch(adminVerify, updateCategoryById);

module.exports = router;
