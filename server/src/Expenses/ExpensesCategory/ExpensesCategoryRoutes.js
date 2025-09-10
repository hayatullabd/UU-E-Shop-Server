const express = require("express");
const {
    getExpensesCategory,
    createExpensesCategory,
    getExpensesCategoryById,
    deleteExpensesCategoryController,
    updateExpensesCategoryById,
} = require("./ExpensesCategoryControllers.js");
const router = express.Router();

router.route("/").get(getExpensesCategory).post(createExpensesCategory)

router
    .route("/:id")
    .get(getExpensesCategoryById)
    .delete(deleteExpensesCategoryController)
    .patch(updateExpensesCategoryById);

module.exports = router;
