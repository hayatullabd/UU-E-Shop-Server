const AccountsModel = require("../Models/AccountsModel");
const mergeTwoArrayWithOutSameValue = require("../../../utils/mergeTwoArrayWithOutSameValue");
const { createHistory } = require("../../History/Services/historyServices");


exports.addOpeningBalanceService = async (data) => {
  const balance = await AccountsModel.create(data);
  if (balance._id) {
    // here made history for account balnace manage
    const historyData = {
      historyTitle: 'Added Opening Balance',
      historyAmount: balance.amount,
      historyParentAccount: balance._id
    }
    // post in history 
    const addHistory = await createHistory(historyData)
    return addHistory;

  }

};


exports.getAccountsService = async (filters, queries) => {
  const Accounts = await AccountsModel.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sort);

  const total = await AccountsModel.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);

  return { total, page, Accounts };
};

exports.updateAccountBalanceByIdService = async (id, data) => {

  let updateBody = { amount: data.amount }

  if (data.bgColor) {
    updateBody.bgColor = data.bgColor
  }



  const result = await AccountsModel.findOneAndUpdate({ _id: id }, updateBody, { upsert: false, new: true });
  if (result) {
    // here made history for account balnace manage
    const historyData = {
      historyTitle: data.historyTitle,
      historyAmount: result.amount,
      historyParentAccount: result._id
    }
    // post in history 
    const addHistory = await createHistory(historyData)
    return addHistory;

  }
  return result;
};
exports.transferBalance = async (id, data) => {

  const result = await AccountsModel.findOneAndUpdate({ _id: id }, data, { upsert: false, new: true });
  if (result) {
    // here made history for account balnace manage
    const historyData = {
      historyTitle: data.historyTitle,
      historyAmount: result.amount,
      historyParentAccount: result._id
    }
    // post in history 
    const addHistory = await createHistory(historyData)
    return addHistory;

  }
  return result;
};


// here code is update from expense or income or return 
exports.updateAccountAndHistoryEIRService = async (id, data) => {

  let result;
  if (data.type === 'expense') {
    result = await AccountsModel.findOneAndUpdate({ _id: id }, { $inc: { amount: -data.amount } }, { upsert: false, new: true });
  }
  if (data.type === 'income' || data.type === "return") {
    result = await AccountsModel.findOneAndUpdate({ _id: id }, { $inc: { amount: data.amount } }, { upsert: false, new: true });
  }

  if (result) {
    // here made history for account balnace manage
    const historyData = {
      historyTitle: data.title,
      historyAmount: data.amount,
      currentAccountBalance: result.amount,
      historyParentAccount: result._id,
      category: data.category || null,
      note: data.note || "",
      type: data.type
    }
    /* 
    balance card er moddhe type dekhabe eta ki type er jodi thake
    note ta collapse system a dekhabe jodi thake
    kon category theke khoros hoyeche seita dekhabe jodi thake
    ekhane history amount holo, koto taka khoros hoyeche
    */
    // post in history 
    const addHistory = await createHistory(historyData)
    return addHistory;

  }
  return result;
};


exports.getAccountBalanceWithId = async (id) => {
  const result = await AccountsModel.findById(id)

  return result;
};
