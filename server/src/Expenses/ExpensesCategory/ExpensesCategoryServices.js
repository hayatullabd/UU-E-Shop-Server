const ExpensesCategory = require("./ExpensesCategoryModels");


exports.getExpensesCategoryService = async (filters, queries) => {
    const result = await ExpensesCategory.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sort);

    const total = await ExpensesCategory.countDocuments(filters);
    const page = Math.ceil(total / queries.limit);
    return { total, page, result };
};



exports.createExpensesCategoryService = async (data) => {
    const result = await ExpensesCategory.create(data);
    return result;
};

exports.getExpensesCategoryByIdService = async (id) => {
    const result = await ExpensesCategory.findById(id);
    return result;
};

exports.deleteExpensesCategoryByIdService = async (id) => {
    const result = await ExpensesCategory.deleteOne({ _id: id });
    return result;
};

exports.updateExpensesCategoryByIdService = async (id, body) => {
    const result = await ExpensesCategory.updateOne({ _id: id }, body);
    return result;
};

