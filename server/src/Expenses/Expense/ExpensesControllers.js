const csv = require("fast-csv");

const {
    getExpensesService,
    createExpensesService,
    updateExpensesByIdService,
    getExpensesByIdService,
    deleteExpensesByIdService,
} = require("./ExpensesServices");
const { default: mongoose } = require("mongoose");
const { updateAccountAndHistoryEIRService } = require("../../AccountingModule/AccountsBalance/Services/AccountsServices");
const { createReturnExpenseService } = require("../ReturnExpenseMoney/ReturnExpenseServices");
const { getAccountBalanceWithId } = require("../../AccountingModule/AccountsBalance/Services/AccountsServices");
const Expenses = require("./ExpensesModels");
const AccountingHistory = require("../../AccountingModule/History/Models/HistoryModel");
const ExpenseCalculateSubItem = require("../ExpenseCalculateSubItem/ExpenseCalculateSubItemModels");
const { getTotalPayableToday, getCurrentMonthTotalAmount } = require("../../utils/todayDueExpnese");
const { getTotalAmountInDateRange } = require("../../utils/todayDueExpnese");

exports.getExpenses = async (req, res) => {
    try {
        let filters = { ...req.query };
        const excludesFields = [
            "limit",
            "page",
            "sort",
            "fields",
            "search",
            "startDate",
            "endDate"
        ];

        excludesFields.forEach((field) => {
            delete filters[field];
        });

        // for search---------------------------------
        if (req.query.search) {
            let oldFilters = filters;
            filters = {
                ...oldFilters,
                $or: [
                    { title: { $regex: req.query.search, $options: "i" } },
                ],
            };
        }

        // -----------query oparators----------------
        /*  let filterString = JSON.stringify(filters);
 
         filterString = filterString.replace(
             /\b(gt|lt|gte|lte)\b/g,
             (match) => `$${match}`
         );
 
         filters = JSON.parse(filterString); */

        // Check if startDate and endDate are provided
        if (req.query.startDate && req.query.endDate) {
            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);

            if (isNaN(startDate) || isNaN(endDate)) {
                return res.status(400).json({
                    status: "fail",
                    message: "Invalid date format in startDate or endDate",
                });
            }

            filters.createdAt = {
                $gte: startDate,
                $lte: endDate,
            };
            // const Accounts = await AccountingHistory.find(filters)

        }
        // ...



        // {name:{$regex:'kash', $option:i}}

        // common-----------------------------------
        let queries = {};
        // ------------pagination------------------
        if (req.query.limit | req.query.page) {
            const { page = 1, limit = 5 } = req.query;
            const skip = (page - 1) * +limit;
            queries.skip = skip;
            queries.limit = +limit;
        }

        // single with multi sorting
        if (req.query.sort) {
            let sortCateory = req.query.sort;
            sortCateory = sortCateory.split(",").join(" ");
            queries.sort = sortCateory;
        }

        // for projection---------------------------------------------
        if (req.query.fields) {
            let select = req.query.fields.split(",").join(" ");
            queries.fields = select;
        }

        const result = await getExpensesService(filters, queries);



        res.status(200).json({
            status: "success",
            message: 'Expenses categories',
            totalReturnAmount: totalSum,
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error: error.message,
        });
    }
};


// accounting overview er moddhe expense income return overview with date filter
exports.ExInReDueExpenseOverview = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Create a match object for date range filtering
        const match = {};
        if (startDate && endDate) {
            match.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // Calculate the totals using aggregation
        const totals = await AccountingHistory.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalExpense: {
                        $sum: { $cond: { if: { $eq: ["$type", "expense"] }, then: "$historyAmount", else: 0 } },
                    },
                    totalIncome: {
                        $sum: { $cond: { if: { $eq: ["$type", "income"] }, then: "$historyAmount", else: 0 } },
                    },
                    totalReturnMoney: {
                        $sum: { $cond: { if: { $eq: ["$type", "return"] }, then: "$historyAmount", else: 0 } },
                    },
                },
            }
        ]);

        // Initialize total values
        let totalExpense = 0;
        let totalIncome = 0;
        let totalReturnMoney = 0;

        if (totals.length > 0) {
            totalExpense = totals[0].totalExpense || 0;
            totalIncome = totals[0].totalIncome || 0;
            totalReturnMoney = totals[0].totalReturnMoney || 0;
        }

        // Calculate totals for "This Month Total Expense" and "This Month Income"
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const thisMonthExpenseResults = await AccountingHistory.aggregate([
            {
                $match: {
                    type: "expense",
                    createdAt: {
                        $gte: firstDayOfMonth,
                        $lte: today,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: "$historyAmount" },
                },
            },
        ]);

        const thisMonthIncomeResults = await AccountingHistory.aggregate([
            {
                $match: {
                    type: "income",
                    createdAt: {
                        $gte: firstDayOfMonth,
                        $lte: today,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$historyAmount" },
                },
            },
        ]);

        const thisMonthExpense = thisMonthExpenseResults.length > 0 ? thisMonthExpenseResults[0].totalExpense : 0;
        const thisMonthIncome = thisMonthIncomeResults.length > 0 ? thisMonthIncomeResults[0].totalIncome : 0;

        // Calculate Today's Expense and Income separately
        const todayExpenseResults = await AccountingHistory.aggregate([
            {
                $match: {
                    type: "expense",
                    createdAt: {
                        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                        $lte: today,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    todayExpense: { $sum: "$historyAmount" },
                },
            },
        ]);

        const todayIncomeResults = await AccountingHistory.aggregate([
            {
                $match: {
                    type: "income",
                    createdAt: {
                        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                        $lte: today,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    todayIncome: { $sum: "$historyAmount" },
                },
            },
        ]);

        const todayExpense = todayExpenseResults.length > 0 ? todayExpenseResults[0].todayExpense : 0;
        const todayIncome = todayIncomeResults.length > 0 ? todayIncomeResults[0].todayIncome : 0;


        const data = await ExpenseCalculateSubItem.find({ isPaid: 'unpaid' })
        let totalExpenseDue = 0;

        if (startDate && endDate) {
            totalExpenseDue = getTotalAmountInDateRange(data, startDate, endDate)


        } else {

            for (const item of data) {
                totalExpenseDue += item.amount;
            }
        }

        const date = new Date()
        const totalDueToday = getTotalPayableToday(data, date)
        const totalDueOfMonth = getCurrentMonthTotalAmount(data)


        res.status(200).json({
            status: "success",
            message: 'Total expenses, total income, and additional details with expense due',
            data: {
                totalExpense,
                totalIncome,
                totalReturnMoney,
                todayExpense,
                thisMonthExpense,
                todayIncome,
                thisMonthIncome,
                totalDueExpense: totalExpenseDue || 0,
                todayDueExpense: totalDueToday || 0,
                thisMonthDueExpense: totalDueOfMonth || 0,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};





/* 
ekhane expnese and income add hobe, jei account ache sei from account theke income hole add hobe
and expnese hole minus hobe and history o genarte hobe, and type dekhanbe expense, income, return
history category id diye filter korbe, kon ta kon category er expense or income or return

*/
exports.createExpensesAndIR = async (req, res) => {
    try {

        const { type, fromBalance, title, amount, category, note } = req.body;

        if (amount < 0) {
            return res.status(200).json({
                status: "fail",
                message: "amount can not negative value",
            });
        }

        const acountBalance = await getAccountBalanceWithId(fromBalance)
        if (!acountBalance) {
            return res.status(200).json({
                status: "fail",
                message: "Bank Account not found",
            });
        }

        if (acountBalance.amount < amount) {
            return res.status(200).json({
                status: "fail",
                message: `have not sufficient balance in ${acountBalance.accountName}`,
            });
        }

        // expenses post
        let updateBalance;


        if (type === 'expense' || type === 'income') {
            const fromAccountId = fromBalance;
            updateBalance = await updateAccountAndHistoryEIRService(fromAccountId, { title, amount, category, note, type })
        } else {
            return res.status(200).json({
                status: "fail",
                message: "Expenses  not inserted!",
            });
        }
        const result = await createExpensesService(req.body);

        res.status(200).json({
            status: "success",
            message: "Expenses  inserted successfully!",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "data is not inserted ",
            error: error.message,
        });
    }
};

exports.getExpensesById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const Expenses = await getExpensesByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'Expenses  by id',
            data: Expenses,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};

exports.deleteExpensesController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const Expenses = await deleteExpensesByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'Expenses  deleted successfully.',
            data: Expenses,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "failed to Expenses  delete",
            error: error.message,
        });
    }
};


exports.updateExpensesById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const Expenses = await updateExpensesByIdService(id, req.body);

        res.status(200).json({
            status: "success",
            message: 'Expense  Updated',
            data: Expenses,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};
