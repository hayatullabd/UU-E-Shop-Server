const mongoose = require("mongoose");

const ReturnExpenseSchema = mongoose.Schema(
    {

        idOfHistory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AccountingHistory",
            required: [true, "Accounting History id required"],
        },
        returnAmount: {
            type: Number,
            required: [true, 'Return Amount required']
        },
        receivedAccountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accounts",
            required: [true, "Balance Account id is required."],
        },
        note: String,
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

const ReturnExpense = mongoose.model("ReturnExpense", ReturnExpenseSchema);

module.exports = ReturnExpense;
