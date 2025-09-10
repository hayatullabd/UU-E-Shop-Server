const express = require("express");
const {
  getBrand,
  createBrand,
  getBrandById,
  updateBrandById,
  deleteBrandById,
} = require("../Controllers/BrandController");
const adminVerify = require("../middlewere/adminVerify");

const router = express.Router();

router.route("/").get(getBrand).post(adminVerify, createBrand);

router
  .route("/:id")
  .get(getBrandById)
  .delete(adminVerify, deleteBrandById)
  .patch(adminVerify, updateBrandById);

module.exports = router;
