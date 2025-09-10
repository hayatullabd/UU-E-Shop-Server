const mongoose = require("mongoose");

const ExpensesSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required."],
            minLength: [2, "title must be at least 2 characters."],
            maxLength: [25, "title is too large"],
        },
        note: String,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accounts",
            required: [true, "category is required."],
        },
        amount: {
            type: Number,
            required: [true, "amount is required."],
            // min: [0, "amount can not negative number"],
        },
        fromBalance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accounts",
            required: [true, "please select account."],
        },
        currentBalance: Number,
        type: {
            type: String,
            required: [true, "type is required."],
            enum: ['expense', 'income', 'returnMoney']
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
