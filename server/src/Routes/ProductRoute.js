const express = require("express");
const {
  getProducts,
  createProduct,
  getProductById,
  deleteProductController,
  updateProductByIdCotnroller,
  getUserInterestedProducts,
  importProducts,
  exportProducts,
} = require("../Controllers/ProductController.js");
const adminVerify = require("../middlewere/adminVerify.js");

const router = express.Router();


router.route("/").get(getProducts).post(adminVerify, createProduct);
router.route("/user-interested-product").get(getUserInterestedProducts);
router.route("/export-product").get(exportProducts);

router
  .route("/:id")
  .get(getProductById)
  .delete(adminVerify, deleteProductController)
  .patch(adminVerify, updateProductByIdCotnroller);

module.exports = router;
