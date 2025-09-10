const { ObjectId } = require("mongodb");
const HistoryModel = require("../Models/HistoryModel");

/* 
for history input filed 
 const historyData = {
    historyTitle: data.historyTitle,
    historyAmount: data.amount,
    historyParentAccount: result._id
  }

 */
exports.createHistory = async (data) => {
  const Accounts = await HistoryModel.create(data);
  return Accounts;
};




exports.getAccountsHisotryService = async (filters, queries) => {
  const Accounts = await HistoryModel.find(filters)
    .populate("historyParentAccount")
    .populate("category")
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sort);

  const total = await HistoryModel.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);

  return { total, page, Accounts };
};



exports.getHistoryByIdService = async (id) => {
  const result = await HistoryModel.findById(id).populate("category")
    .populate("historyParentAccount")

  return result;
};


