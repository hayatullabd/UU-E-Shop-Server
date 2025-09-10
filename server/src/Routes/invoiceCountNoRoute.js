const express = require("express");
const {
  getInvoiceNumber,
  createInvoiceNumber,
  getInvoiceNumberById,
  updateInvoiceNumberById,
  deleteInvoiceNumberById,
  getTotalPriceOfCarSelection,
  incrementOneAndGet,
} = require("../Controllers/invoiceCountNoController");

const router = express.Router();

router.route("/").get(getInvoiceNumber).post(createInvoiceNumber).patch(incrementOneAndGet);
router.route("/get-total-price").post(getTotalPriceOfCarSelection);
router
  .route("/:id")
  .get(getInvoiceNumberById)
  .delete(deleteInvoiceNumberById)
  .patch(updateInvoiceNumberById);

module.exports = router;
