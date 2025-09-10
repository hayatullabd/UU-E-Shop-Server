const express = require("express");
const {
  getOrder,
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getTotalPriceOfCarSelection,
  cancelOrderMangeStock,
  exportOrders,
  updateUserOrderById,
} = require("../Controllers/orderController");
const adminVerify = require("../middlewere/adminVerify");

const router = express.Router();

router.route("/").get(getOrder).post(createOrder);
router.route("/get-total-price").post(getTotalPriceOfCarSelection);
router.route("/cancel-order").post(cancelOrderMangeStock);
router.route("/export-orders").get(exportOrders);
router.patch("/update-user/:id",updateUserOrderById)
router
  .route("/:id")
  .get(getOrderById)
  .delete(adminVerify, deleteOrderById)
  .patch(updateOrderById);

module.exports = router;
