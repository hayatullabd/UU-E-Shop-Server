const ExpenseCalculateSubItem = require("./ExpenseCalculateSubItemModels");


exports.getExpenseCalculateSubItemService = async (filters, queries) => {
    const result = await ExpenseCalculateSubItem.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sort)

    const total = await ExpenseCalculateSubItem.countDocuments(filters);
    const page = Math.ceil(total / queries.limit);
    return { total, page, result };
};



exports.createExpenseCalculateSubItemService = async (data) => {
    const result = await ExpenseCalculateSubItem.create(data);
    return result;
};

exports.getExpenseCalculateSubItemByIdService = async (id) => {
    const result = await ExpenseCalculateSubItem.findById(id);
    return result;
};

exports.deleteExpenseCalculateSubItemByIdService = async (id) => {
    const result = await ExpenseCalculateSubItem.deleteOne({ _id: id });
    // const blunkUpdate = await ExpenseCalculateSubItem.updateMany({}, { $inc: { rowPosition: -1 } })
    return result;
};

exports.updateExpenseCalculateSubItemByIdService = async (id, body) => {
    const result = await ExpenseCalculateSubItem.updateOne({ _id: id }, body);
    return result;
};

