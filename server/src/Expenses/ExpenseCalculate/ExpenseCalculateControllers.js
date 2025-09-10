const csv = require("fast-csv");

const {
    getExpenseCalculateService,
    createExpenseCalculateService,
    updateExpenseCalculateByIdService,
    getExpenseCalculateByIdService,
    deleteExpenseCalculateByIdService,
} = require("./ExpenseCalculateServices");
const { default: mongoose } = require("mongoose");
const ExpenseCalculate = require("./ExpenseCalculateModels");
const ExpenseCalculateSubItem = require("../ExpenseCalculateSubItem/ExpenseCalculateSubItemModels");

exports.getExpenseCalculate = async (req, res) => {
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
        // -----------query oparators----------------


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

        const result = await getExpenseCalculateService(filters, queries);

        res.status(200).json({
            status: "success",
            message: 'ExpenseCalculate categories',
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
exports.getExpenseCalculateAll = async (req, res) => {
    try {
        const expenseCalculates = await ExpenseCalculate.find({}).sort({ columnPosition: 1 }).exec();

        // Create an array to store the formatted data
        const formattedData = [];

        // Loop through each ExpenseCalculate document
        for (const expenseCalculate of expenseCalculates) {
            // Fetch related ExpenseCalculateSubItem documents
            const subItems = await ExpenseCalculateSubItem.find({
                parentId: expenseCalculate._id,
            }).sort({ rowPosition: 1 }).exec();

            // Create a formatted object for the current ExpenseCalculate document
            const formattedExpenseCalculate = {
                _id: expenseCalculate._id,
                title: expenseCalculate.title,
                columnPosition: expenseCalculate.columnPosition,
                status: expenseCalculate.status,
                subItem: [],
            };

            // Loop through each ExpenseCalculateSubItem document and add to subItem array
            for (const subItem of subItems) {
                formattedExpenseCalculate.subItem.push({
                    _id: subItem._id,
                    title: subItem.title,
                    rowPosition: subItem.rowPosition,
                    payableDate: subItem.payableDate,
                    amount: subItem.amount,
                    parentId: subItem.parentId,
                    status: subItem.status,
                });
            }

            // Add the formattedExpenseCalculate to the formattedData array
            formattedData.push(formattedExpenseCalculate);
        }



        res.status(200).json({
            status: "success",
            message: 'All Expense Calculate ',
            data: formattedData,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error: error.message,
        });
    }
};



exports.createExpenseCalculate = async (req, res) => {
    try {
        const { title } = req.body;
        const result = await ExpenseCalculate.findOne({}).sort({ columnPosition: -1 }).exec()
        let columnPosition = (result?.columnPosition + 1) || 1

        const newExpenseCalculate = await createExpenseCalculateService({ title, columnPosition: columnPosition });

        res.status(200).json({
            status: "success",
            message: "ExpenseCalculate  inserted successfully!",
            data: newExpenseCalculate,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "data is not inserted ",
            error: error.message,
        });
    }
};

exports.getExpenseCalculateById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ExpenseCalculate = await getExpenseCalculateByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'ExpenseCalculate  by id',
            data: ExpenseCalculate,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};

exports.deleteExpenseCalculateController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }



        const ExpenseCalculate = await deleteExpenseCalculateByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'ExpenseCalculate  deleted successfully.',
            data: ExpenseCalculate,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "failed to ExpenseCalculate  delete",
            error: error.message,
        });
    }
};


exports.updateExpenseCalculateById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ExpenseCalculate = await updateExpenseCalculateByIdService(id, req.body);

        res.status(200).json({
            status: "success",
            message: 'Expense  Updated',
            data: ExpenseCalculate,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};


exports.bulkUpdateColumn = async (req, res) => {
    try {

        const updates = req.body; // Assumes that the request body contains an array of updates

        // Use bulkWrite to perform multiple update operations efficiently
        const bulkOperations = updates.map((update) => ({
            updateOne: {
                filter: { _id: update._id }, // Assuming each update object has an _id field
                update: { $set: update }, // Update the document with the given fields in the update object
            },
        }));

        const result = await ExpenseCalculate.bulkWrite(bulkOperations);

        res.status(200).json({
            status: "success",
            message: "Bulk update successful",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};
