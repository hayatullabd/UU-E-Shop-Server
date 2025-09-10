const Expenses = require("./ExpensesModels");


exports.getExpensesService = async (filters, queries) => {
    const result = await Expenses.find(filters)
        .populate('receivedAccountId')
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sort);

    const total = await Expenses.countDocuments(filters);
    const page = Math.ceil(total / queries.limit);
    return { total, page, result };
};



exports.createExpensesService = async (data) => {
    const result = await Expenses.create(data);
    return result;
};

exports.getExpensesByIdService = async (id) => {
    const result = await Expenses.findById(id);
    return result;
};

exports.deleteExpensesByIdService = async (id) => {
    const result = await Expenses.deleteOne({ _id: id });
    return result;
};

exports.updateExpensesByIdService = async (id, body) => {
    const result = await Expenses.updateOne({ _id: id }, body);
    return result;
};

