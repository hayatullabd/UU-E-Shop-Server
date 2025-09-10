const csv = require("fast-csv");

const {
    getExpenseCalculateSubItemService,
    createExpenseCalculateSubItemService,
    updateExpenseCalculateSubItemByIdService,
    getExpenseCalculateSubItemByIdService,
    deleteExpenseCalculateSubItemByIdService,
} = require("./ExpenseCalculateSubItemServices");
const { default: mongoose } = require("mongoose");
const ExpenseCalculateSubItem = require("./ExpenseCalculateSubItemModels");
const { ObjectId } = mongoose.Types;


exports.getExpenseCalculateSubItem = async (req, res) => {
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
        /*  let filterString = JSON.stringify(filters);
 
         filterString = filterString.replace(
             /\b(gt|lt|gte|lte)\b/g,
             (match) => `$${match}`
         );
 
         filters = JSON.parse(filterString); */

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

        const result = await getExpenseCalculateSubItemService(filters, queries);

        res.status(200).json({
            status: "success",
            message: 'ExpenseCalculateSubItem categories',
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


exports.createExpenseCalculateSubItem = async (req, res) => {
    try {

        const { parentId, rowPosition, ...rest } = req.body;
        const id = new ObjectId(parentId);

        const highestRowPositionDocument = await ExpenseCalculateSubItem.findOne({})
            .sort({ rowPosition: -1 }) // Sort in descending order by rowPosition
            .exec();
        let positionCount = (highestRowPositionDocument?.rowPosition + 1) || 1

        const newExpenseCalculateSubItem = await createExpenseCalculateSubItemService({ ...rest, rowPosition: positionCount, parentId });

        res.status(200).json({
            status: "success",
            message: "ExpenseCalculateSubItem  inserted successfully!",
            data: newExpenseCalculateSubItem,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "data is not inserted ",
            error: error.message,
        });
    }
};

exports.getExpenseCalculateSubItemById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ExpenseCalculateSubItem = await getExpenseCalculateSubItemByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'ExpenseCalculateSubItem  by id',
            data: ExpenseCalculateSubItem,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};

exports.deleteExpenseCalculateSubItemController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ExpenseCalculateSubItem = await deleteExpenseCalculateSubItemByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'ExpenseCalculateSubItem  deleted successfully.',
            data: ExpenseCalculateSubItem,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "failed to ExpenseCalculateSubItem  delete",
            error: error.message,
        });
    }
};


exports.updateExpenseCalculateSubItemById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ExpenseCalculateSubItem = await updateExpenseCalculateSubItemByIdService(id, req.body);

        res.status(200).json({
            status: "success",
            message: 'Expense  Updated',
            data: ExpenseCalculateSubItem,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};
exports.bulkUpdateRow = async (req, res) => {
    try {

        const updates = req.body; // Assumes that the request body contains an array of updates

        // Use bulkWrite to perform multiple update operations efficiently
        const bulkOperations = updates.map((update) => ({
            updateOne: {
                filter: { _id: update._id }, // Assuming each update object has an _id field
                update: { $set: update }, // Update the document with the given fields in the update object
            },
        }));

        const result = await ExpenseCalculateSubItem.bulkWrite(bulkOperations);

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

