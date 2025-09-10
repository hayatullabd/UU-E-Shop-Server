const mongoose = require("mongoose");
const validator = require("validator");

const AccountingHistorySchema = mongoose.Schema(
    {
        historyTitle: {
            type: String,
            required: [true, "History title is required."],
        },
        historyAmount: {
            type: Number,
            required: [true, "Amount is required."],
        },
        currentAccountBalance: {
            type: Number,
            required: [false, "Amount is required."],
        },
        historyParentAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accounts",
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExpensesCategory",
        },
        note: String,
        type: {
            type: String,
            enum: ['expense', 'income', 'return']
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

const AccountingHistory = mongoose.model("AccountingHistory", AccountingHistorySchema);

module.exports = AccountingHistory;
