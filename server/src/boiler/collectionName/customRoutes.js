const express = require("express");
const {
    getExpenses,
    createExpenses,
    getExpensesById,
    deleteExpensesController,
    updateExpensesById,
} = require("./customControllers.js");
const router = express.Router();

router.route("/").get(getExpenses).post(createExpenses)

router
    .route("/:id")
    .get(getExpensesById)
    .delete(deleteExpensesController)
    .patch(updateExpensesById);

module.exports = router;
