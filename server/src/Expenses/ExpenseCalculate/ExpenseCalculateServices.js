const ExpenseCalculateSubItem = require("../ExpenseCalculateSubItem/ExpenseCalculateSubItemModels");
const ExpenseCalculate = require("./ExpenseCalculateModels");


exports.getExpenseCalculateService = async (filters, queries) => {
    const result = await ExpenseCalculate.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sort);

    const total = await ExpenseCalculate.countDocuments(filters);
    const page = Math.ceil(total / queries.limit);
    return { total, page, result };
};



exports.createExpenseCalculateService = async (data) => {
    const result = await ExpenseCalculate.create(data);
    return result;
};

exports.getExpenseCalculateByIdService = async (id) => {
    const result = await ExpenseCalculate.findById(id);
    return result;
};

exports.deleteExpenseCalculateByIdService = async (id) => {
    const result = await ExpenseCalculate.deleteOne({ _id: id });
    const deleteAllSubItemUnderOfColumn = await ExpenseCalculateSubItem.deleteMany({ parentId: id })
    // jokhon kono ekta colmun delte hobe, postion 1 kore kombe sob gular

    return result;
};

exports.updateExpenseCalculateByIdService = async (id, body) => {
    const result = await ExpenseCalculate.updateOne({ _id: id }, body);
    return result;
};

