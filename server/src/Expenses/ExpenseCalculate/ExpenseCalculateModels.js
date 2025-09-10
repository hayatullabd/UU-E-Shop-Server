const mongoose = require("mongoose");

const ExpenseCalculateSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "ExpenseCalculate name is required."],
            unique: [true, "ExpenseCalculate Name must be unique"],
            minLength: [2, "ExpenseCalculate Name must be at least 2 characters."],
            maxLength: [150, "ExpenseCalculate Name is too large"],
        },
        columnPosition: {
            type: Number,
            default: 0
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

const ExpenseCalculate = mongoose.model("ExpenseCalculate", ExpenseCalculateSchema);

module.exports = ExpenseCalculate;


const need = [
    {
        title: "",
        columnPosition: "",
        status: "",
        subItem: [
            {
                title: "",
                rowPosition: "",
                payableDate: "",
                amount: "",
                parentId: {},
                status: "",
            }
        ]
    },
]