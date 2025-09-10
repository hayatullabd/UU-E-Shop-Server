const express = require("express");
const {
    getExpenses,
    createExpensesAndIR,
    getExpensesById,
    deleteExpensesController,
    updateExpensesById,
    ExInReDueExpenseOverview
} = require("./ExpensesControllers.js");
const router = express.Router();

router.route("/").get(getExpenses).post(createExpensesAndIR)
router.route("/overview-expense-income-return").get(ExInReDueExpenseOverview)
router
    .route("/:id")
    .get(getExpensesById)
    .delete(deleteExpensesController)
    .patch(updateExpensesById);

module.exports = router;
