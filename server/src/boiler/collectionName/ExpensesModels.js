const mongoose = require("mongoose");

const ExpensesSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Expenses name is required."],
            unique: [true, "Expenses Name must be unique"],
            minLength: [2, "Expenses Name must be at least 2 characters."],
            maxLength: [150, "Expenses Name is too large"],
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

const Expenses = mongoose.model("Expenses", ExpensesSchema);

module.exports = Expenses;
