const csv = require("fast-csv");
const {
    getReturnExpenseService,
    createReturnExpenseService,
    updateReturnExpenseByIdService,
    getReturnExpenseByIdService,
    deleteReturnExpenseByIdService,
} = require("./ReturnExpenseServices");
const { default: mongoose } = require("mongoose");
const { getHistoryByIdService } = require("../../AccountingModule/History/Services/historyServices");
const { updateAccountAndHistoryEIRService, getAccountBalanceWithId } = require("../../AccountingModule/AccountsBalance/Services/AccountsServices");
const { ObjectId } = mongoose.Types;
const ReturnExpense = require("./ReturnExpenseModels");

exports.getReturnExpense = async (req, res) => {
    try {

        console.log('check return')

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

        const result = await getReturnExpenseService(filters, queries);
        let totalSum = 0;
        if (result.result.length > 0) {
            totalSum = result.result.reduce((sum, expense) => sum + expense.returnAmount, 0);
        }

        res.status(200).json({
            status: "success",
            message: 'Expenses categories',
            data: { totalReturn: totalSum, ...result },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error: error.message,
        });
    }
};


exports.createReturnExpense = async (req, res) => {
    try {
        /* {
    "idOfHistory":"650fb2921ef7696924e0534e",
    "categoryName":"Subscription",
    "returnAmount":100,
    "receivedAccountId":"650a8f15b4fe1f2853c86d1e"
} */
        // step= history id diye dekha laagbe expense amount koto
        const { idOfHistory, returnAmount, receivedAccountId } = req.body
        // aggraagte use for tatal amount of account balance

        // Convert the idOfHistory string to a mongoose ObjectId
        const idOfHistoryObjectId = new ObjectId(req.body.idOfHistory);
        const aggregationPipeline = [
            // Match documents based on the converted idOfHistory
            { $match: { idOfHistory: idOfHistoryObjectId } },
            // Project only the "returnAmount" field
            { $project: { returnAmount: 1 } },
            // Group all documents and calculate the total amount
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$returnAmount" },
                },
            },
        ];

        // Use the aggregation pipeline to calculate the total amount
        const totalAmountAllAccounts = await ReturnExpense.aggregate(aggregationPipeline);




        // find expense hisotry
        const historyDataResult = await getHistoryByIdService(idOfHistory)
        // find to account balance
        const accountBalance = await getAccountBalanceWithId(receivedAccountId)
        if (!accountBalance) {
            return res.status(200).json({
                status: "fail",
                message: "Bank Account not found!!",
            });
        }
        if (!historyDataResult) {
            return res.status(200).json({
                status: "fail",
                message: "Expense not not found!!",
            });
        }

        const totalPay = ((totalAmountAllAccounts[0]?.totalAmount ? totalAmountAllAccounts[0]?.totalAmount : 0) + parseInt(returnAmount))


        if (totalPay > historyDataResult.historyAmount) {
            return res.status(200).json({
                status: "fail",
                message: "Can not received return mony up to expense!!",
            });
        }






        /*  // step 2= return ammount theke jodi expense amount kom hoy tobe error
         if (historyDataResult.historyAmount < returnAmount) {
             return res.status(200).json({
                 status: "fail",
                 message: "Return amount can't be large from expense amount",
             });
         } */

        // step1 = recved account id thik ache kina jodi thik thake tobe account balance jeita select kora hoise seita + kore dite hobe
        const historyData = {
            title: `Balance Received: ${returnAmount} taka return from ${historyDataResult.category.title} Category`,
            amount: returnAmount,
            note: `Expense Reason: ${historyDataResult.historyTitle}.${req.body.note ? req.body.note : ""}`,
            type: "return",
            // category id holo expense income and return jei category er moddhe ache sei category er id 
            category: req.body.categoryId || null

        }


        const updateBalanceAndHistory = await updateAccountAndHistoryEIRService(accountBalance._id, historyData)




        const newReturnExpense = await createReturnExpenseService({ idOfHistory, returnAmount, receivedAccountId, note: req.body.note });



        res.status(200).json({
            status: "success",
            message: "Money Return successfully done!",
            data: newReturnExpense,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "data is not inserted ",
            error: error.message,
        });
    }
};

exports.getReturnExpenseById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ReturnExpense = await getReturnExpenseByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'Expenses category by id',
            data: ReturnExpense,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};

exports.deleteReturnExpenseController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ReturnExpense = await deleteReturnExpenseByIdService(id);

        res.status(200).json({
            status: "success",
            message: 'Expenses Category deleted successfully.',
            data: ReturnExpense,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "failed to Expenses Category delete",
            error: error.message,
        });
    }
};


exports.updateReturnExpenseById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(200).json({
                status: 'fail',
                message: 'invalid id'
            })
        }
        const ReturnExpense = await updateReturnExpenseByIdService(id, req.body);

        res.status(200).json({
            status: "success",
            message: 'Expense Category Updated',
            data: ReturnExpense,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};

