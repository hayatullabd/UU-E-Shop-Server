const express = require("express");
const {
  getDeliveryCost,
  createDeliveryCost,
  getDeliveryCostById,
  updateDeliveryCostById,
  deleteDeliveryCostById,
  createOthersCityShippingCost,
  updateOthersCityShippingCost,
  getOthersCityShippingCost,
  getShippingCostForUser,
  updateDeliveryCost,
} = require("../Controllers/deliveryCostController");
const adminVerify = require("../middlewere/adminVerify");

const router = express.Router();

router.route("/").get(getDeliveryCost).post(createDeliveryCost);
router.route("/update-delivery-cost").put(adminVerify, updateDeliveryCost);
router
  .route("/others-city-shipping-cost")
  .post(adminVerify, createOthersCityShippingCost)
  .patch(adminVerify, updateOthersCityShippingCost)
  .get(getOthersCityShippingCost);
router.route("/get-delivery-for-user").get(getShippingCostForUser);
router
  .route("/:id")
  .get(getDeliveryCostById)
  .delete(deleteDeliveryCostById)
  .patch(updateDeliveryCostById);

module.exports = router;
