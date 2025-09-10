const csv = require("fast-csv");

const {
    getExpensesService,
    createExpensesService,
    updateExpensesByIdService,
    getExpensesByIdService,
    deleteExpensesByIdService,
} = require("./customServices");
const { default: mongoose } = require("mongoose");

exports.getExpenses = async (req, res) => {
    try {
        const { modelName, populate, searchKey } = req.query
        if (!modelName) {
            return res.status(200).json({
                status: "success",
                message: 'please give modelName',
            });
        }
        const Model = mongoose.model(modelName);

        let filters = { ...req.query };
        const excludesFields = [
            "limit",
            "page",
            "sort",
            "fields",
            "search",
            "searchKey",
            "modelName"
        ];

        excludesFields.forEach((field) => {
            delete filters[field];
        });

        // for search---------------------------------
        if (req.query.search && searchKey) {
            const searchFormat = searchKey.split(',')
            let oldFilters = filters;
            filters = {
                ...oldFilters,
                $or: searchFormat.map(srKey => { return { [srKey]: { $regex: req.query.search, $options: "i" } } })

            };
        }
        if (req.query.sub) {
            let oldFilters = filters;
            filters = {
                ...oldFilters,
                sub: { $in: req.query.sub },
            };
        }

        // -----------query oparators----------------
        let filterString = JSON.stringify(filters);

        filterString = filterString.replace(
            /\b(gt|lt|gte|lte)\b/g,
            (match) => `$${match}`
        );

        filters = JSON.parse(filterString);

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

        const result = await getExpensesService(Model, populate, filters, queries);

        res.status(200).json({
            status: "success",
            message: 'Expenses categories',
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


exports.createExpenses = async (req, res) => {
    try {
        const { body, modelName } = req.body
        if (!modelName) {
            return res.status(200).json({
                status: "success",
                message: 'please give model name',
                data: result,
            });
        }
        const Model = mongoose.model(modelName);
        const newExpenses = await createExpensesService(Model, body);

        res.status(200).json({
            status: "success",
            message: "Expenses  inserted successfully!",
            data: newExpenses,
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
        const { modelName, populate } = req.query


        if (!modelName) {
            return res.status(200).json({
                status: "success",
                message: 'please give model name',
                data: result,
            });
        }
        const Model = mongoose.model(modelName);

        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const Expenses = await getExpensesByIdService(Model, populate, id);

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
        const { modelName } = req.query
        if (!modelName) {
            return res.status(200).json({
                status: "success",
                message: 'please give model name',
                data: result,
            });
        }
        const Model = mongoose.model(modelName);
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const Expenses = await deleteExpensesByIdService(Model, id);

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
        const { body, modelName } = req.body
        if (!modelName) {
            return res.status(200).json({
                status: "success",
                message: 'please give model name',
                data: result,
            });
        }
        const Model = mongoose.model(modelName);
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const Expenses = await updateExpensesByIdService(Model, id, body);

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

