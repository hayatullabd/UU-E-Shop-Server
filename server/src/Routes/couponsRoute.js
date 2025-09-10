const express = require("express");
const {
  getCoupons,
  createCoupons,
  getCouponsById,
  updateCouponsById,
  deleteCouponsById,
  couponVerifyAndGetPrice,
} = require("../Controllers/couponsController");

const router = express.Router();

router.route("/").get(getCoupons).post(createCoupons);
router.route("/coupon-verify").post(couponVerifyAndGetPrice);

router
  .route("/:id")
  .get(getCouponsById)
  .delete(deleteCouponsById)
  .patch(updateCouponsById);

module.exports = router;
