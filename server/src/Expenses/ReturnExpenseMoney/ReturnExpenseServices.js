const ReturnExpense = require("./ReturnExpenseModels");


exports.getReturnExpenseService = async (filters, queries) => {
    const result = await ReturnExpense.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sort);

    const total = await ReturnExpense.countDocuments(filters);
    const page = Math.ceil(total / queries.limit);
    return { total, page, result };
};



exports.createReturnExpenseService = async (data) => {
    const result = await ReturnExpense.create(data);
    return result;
};

exports.getReturnExpenseByIdService = async (id) => {
    const result = await ReturnExpense.findById(id);
    return result;
};

exports.deleteReturnExpenseByIdService = async (id) => {
    const result = await ReturnExpense.deleteOne({ _id: id });
    return result;
};

exports.updateReturnExpenseByIdService = async (id, body) => {
    const result = await ReturnExpense.updateOne({ _id: id }, body);
    return result;
};

