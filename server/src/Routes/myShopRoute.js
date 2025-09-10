const express = require("express");
const {
  getMyShop,
  createMyShop,
  getMyShopById,
  updateMyShopById,
  deleteMyShopById,
  updateShop,
} = require("../Controllers/myShopController");
const adminVerify = require("../middlewere/adminVerify");

const router = express.Router();

router.route("/").get(getMyShop).post(adminVerify, createMyShop);
router.route("/update-shop").put(adminVerify, updateShop);

router
  .route("/:id")
  .get(getMyShopById)
  .delete(adminVerify, deleteMyShopById)
  .patch(adminVerify, updateMyShopById);

module.exports = router;
