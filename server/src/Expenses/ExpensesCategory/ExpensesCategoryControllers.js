const csv = require("fast-csv");

const {
    getExpensesCategoryService,
    createExpensesCategoryService,
    updateExpensesCategoryByIdService,
    getExpensesCategoryByIdService,
    deleteExpensesCategoryByIdService,
} = require("./ExpensesCategoryServices");
const { default: mongoose } = require("mongoose");
const HistoryModel = require("../../AccountingModule/History/Models/HistoryModel");
const { calculateCategoryTotals } = require("../../utils/retunTotalOfExpneseIncome");


exports.getExpensesCategory = async (req, res) => {
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
        if (req.query.subCategory) {
            let oldFilters = filters;
            filters = {
                ...oldFilters,
                subCategory: { $in: req.query.subCategory },
            };
        }

        // -----------query oparators----------------
        /*    let filterString = JSON.stringify(filters);
   
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
        //
        // {name:{$regex:'kash', $option:i}}

        // common-----------------------------------
        let queries = {};
        // ------------pagination------------------
        if (req.query.limit | req.query.page) {
            const { page = 1, limit = 5 } = req.query;
            const skipCategory = (page - 1) * +limit;
            queries.skip = skipCategory;
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
            let selectCategory = req.query.fields.split(",").join(" ");
            queries.fields = selectCategory;
        }

        const result = await getExpensesCategoryService(filters, queries);

        if (result && result.result && Array.isArray(result.result)) {
            const allHistory = await HistoryModel.find({});
            const categoryTotals = calculateCategoryTotals(result.result, allHistory);

            res.status(200).json({
                status: "success",
                message: 'Expenses categories',
                data: { categoryTotals, result },
            });
        } else {
            res.status(400).json({
                status: "fail",
                message: "Invalid data structure for categories",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error: error.message,
        });
    }
};


exports.createExpensesCategory = async (req, res) => {
    try {
        const newExpensesCategory = await createExpensesCategoryService(req.body);

        res.status(200).json({
            status: "success",
            message: "Expenses Category inserted successfully!",
            data: newExpensesCategory,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "data is not inserted ",
            error: error.message,
        });
    }
};

exports.getExpensesCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ExpensesCategory = await getExpensesCategoryByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'Expenses category by id',
            data: ExpensesCategory,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};

exports.deleteExpensesCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ExpensesCategory = await deleteExpensesCategoryByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'Expenses Category deleted successfully.',
            data: ExpensesCategory,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "failed to Expenses Category delete",
            error: error.message,
        });
    }
};


exports.updateExpensesCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        if (req.body.title.length > 25) {
            return res.status(200).json({
                status: 'fail',
                message: 'title is too large'
            })
        }
        const ExpensesCategory = await updateExpensesCategoryByIdService(id, req.body);

        res.status(200).json({
            status: "success",
            message: 'Expense Category Updated',
            data: ExpensesCategory,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};

