const express = require("express");
const {
    getExpenseCalculate,
    createExpenseCalculate,
    getExpenseCalculateById,
    deleteExpenseCalculateController,
    updateExpenseCalculateById,
    getExpenseCalculateAll,
    bulkUpdateColumn
} = require("./ExpenseCalculateControllers.js");
const router = express.Router();

router.route("/").get(getExpenseCalculate).post(createExpenseCalculate)
router.route("/all").get(getExpenseCalculateAll)
router.route("/column-item-bulk-update").patch(bulkUpdateColumn)

router
    .route("/:id")
    .get(getExpenseCalculateById)
    .delete(deleteExpenseCalculateController)
    .patch(updateExpenseCalculateById);

module.exports = router;
