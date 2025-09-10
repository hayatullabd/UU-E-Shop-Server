const mongoose = require("mongoose");

const ExpenseCalculateSubItemSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "ExpenseCalculateSubItem name is required."],
            unique: [true, "ExpenseCalculateSubItem Name must be unique"],
            minLength: [2, "ExpenseCalculateSubItem Name must be at least 2 characters."],
            maxLength: [150, "ExpenseCalculateSubItem Name is too large"],
        },

        rowPosition: {
            type: Number,
            required: [true, 'rowPosition required']
        },
        payableDate: {
            type: String,
            required: [true, 'payable date is require']
        },
        amount: {
            type: Number,
            default: 0
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ExpenseCalculate",
            required: [true, 'Expense calculate parent id required'],
        },
        isPaid: {
            type: String,
            enum: ['paid', 'unpaid'],
            default: 'unpaid'
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

const ExpenseCalculateSubItem = mongoose.model("ExpenseCalculateSubItem", ExpenseCalculateSubItemSchema);

module.exports = ExpenseCalculateSubItem;
