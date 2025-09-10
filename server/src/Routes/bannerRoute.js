const express = require("express");
const {
  getBanner,
  createBanner,
  getBannerById,
  updateBannerById,
  deleteBannerById,
} = require("../Controllers/bannerController");
const adminVerify = require("../middlewere/adminVerify");

const router = express.Router();

router.route("/").get(getBanner).post(adminVerify, createBanner);
router
  .route("/:id")
  .get(getBannerById)
  .delete(adminVerify, deleteBannerById)
  .patch(adminVerify, updateBannerById);

module.exports = router;
