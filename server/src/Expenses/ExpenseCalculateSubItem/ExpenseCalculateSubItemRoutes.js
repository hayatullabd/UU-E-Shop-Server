const express = require("express");
const {
    getExpenseCalculateSubItem,
    createExpenseCalculateSubItem,
    getExpenseCalculateSubItemById,
    deleteExpenseCalculateSubItemController,
    updateExpenseCalculateSubItemById,
    bulkUpdateRow
} = require("./ExpenseCalculateSubItemControllers.js");
const router = express.Router();

router.route("/").get(getExpenseCalculateSubItem).post(createExpenseCalculateSubItem)
router.route("/sub-item-bulk-update").patch(bulkUpdateRow)

router
    .route("/:id")
    .get(getExpenseCalculateSubItemById)
    .delete(deleteExpenseCalculateSubItemController)
    .patch(updateExpenseCalculateSubItemById);

module.exports = router;
