const Advertise = require("../Models/advertiseModel");

exports.getExpensesService = async (ModelName, populate = null, filters, queries) => {
    const result = await ModelName.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sort);

    if (Array.isArray(populate) && populate.length > 0) {
        populate.forEach(field => {
            result = result.populate(field);
        });
    }
    const total = await ModelName.countDocuments(filters);
    const page = Math.ceil(total / queries.limit);
    return { total, page, result };
};



exports.createExpensesService = async (ModelName, data) => {
    const result = await ModelName.create(data);
    return result;
};

exports.getExpensesByIdService = async (ModelName, populate = null, id) => {
    const result = await ModelName.findById(id);
    if (Array.isArray(populate) && populate.length > 0) {
        populate.forEach(field => {
            result = result.populate(field);
        });
    }
    return result;
};

exports.deleteExpensesByIdService = async (ModelName, id) => {
    const result = await ModelName.deleteOne({ _id: id });
    return result;
};

exports.updateExpensesByIdService = async (ModelName, id, body) => {
    const result = await ModelName.findOneAndUpdate({ _id: id }, body);
    return result;
};

