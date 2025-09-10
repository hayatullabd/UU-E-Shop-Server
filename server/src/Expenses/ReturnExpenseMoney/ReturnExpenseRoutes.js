const express = require("express");
const {
    getReturnExpense,
    createReturnExpense,
    getReturnExpenseById,
    deleteReturnExpenseController,
    updateReturnExpenseById,
} = require("./ReturnExpenseControllers.js");
const router = express.Router();

router.route("/").get(getReturnExpense).post(createReturnExpense)

router
    .route("/:id")
    .get(getReturnExpenseById)
    .delete(deleteReturnExpenseController)
    .patch(updateReturnExpenseById);

module.exports = router;
