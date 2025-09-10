const mongoose = require("mongoose");

const ExpensesCategorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Category name is required."],
            unique: [true, "Category Name must be unique"],
            minLength: [2, "Category Name must be at least 2 characters."],
            maxLength: [25, "Category Name is too large"],
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const ExpensesCategory = mongoose.model("ExpensesCategory", ExpensesCategorySchema);

module.exports = ExpensesCategory;
