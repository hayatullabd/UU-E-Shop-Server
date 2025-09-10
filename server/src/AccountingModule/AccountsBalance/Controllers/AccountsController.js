const csv = require("fast-csv");
const AccountsModel = require("../Models/AccountsModel");
let { ObjectID } = require("mongodb")


const {
  addOpeningBalanceService,
  getAccountsService,
  updateAccountBalanceByIdService,
} = require("../Services/AccountsServices");
const Accounts = require("../Models/AccountsModel");
const { getAccountsHisotryService, getHistoryByIdService, createHistory } = require("../../History/Services/historyServices");
const { default: mongoose } = require("mongoose");
const AccountingHistory = require("../../History/Models/HistoryModel");


// add opening balance here add opening balance and sent data to history collection
exports.AddOpeningBalance = async (req, res) => {
  try {

    const balance = await addOpeningBalanceService(req.body);


    res.status(200).json({
      status: "success",
      message: "Balance added successfully.",
      data: balance,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Balance added failed!",
      error: error.message,
    });
  }
};

// get all acounts 
exports.getAccounts = async (req, res) => {
  try {
    let filters = { ...req.query };
    const excludesFields = [
      "limit",
      "page",
      "sort",
      "fields",
      "search",
    ];

    excludesFields.forEach((field) => {
      delete filters[field];
    });

    // for search---------------------------------
    if (req.query.search) {
      // let oldFilters = filters;
      filters = {
        $or: [
          { accountName: { $regex: req.query.search, $options: "i" } },

        ],
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

    const result = await getAccountsService(filters, queries);

    // aggraagte use for tatal amount of account balance
    const aggregationPipeline = [
      // Match documents based on filters
      { $match: {} },
      // Project only the "amount" field
      { $project: { amount: 1 } },
      // Group all documents and calculate the total amount
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ];

    // Use the aggregation pipeline to calculate the total amount
    const totalAmountAllAccounts = await AccountsModel.aggregate(aggregationPipeline);

    res.status(200).json({
      status: "success",
      message: "All accounts.",
      totalAmount: totalAmountAllAccounts[0]?.totalAmount || 0,
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

// get all accounts and acounts history 
exports.getAccountsHistory = async (req, res) => {
  try {
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
          { historyTitle: { $regex: req.query.search, $options: "i" } },

        ],
      };
    }



    // Check if startDate and endDate are provided
    // ...
    // ...
    // Check if startDate and endDate are provided
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
    // ...



    // -----------query oparators----------------
    /*  let filterString = JSON.stringify(filters);
 
     filterString = filterString.replace(
       /\b(gt|lt|gte|lte)\b/g,
       (match) => `$${match}`
     );
 
     filters = JSON.parse(filterString); */

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



    const result = await getAccountsHisotryService(filters, queries);


    res.status(200).json({
      status: "success",
      totalAmount: '',
      message: "Accounts History.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get account history",
      error: error.message,
    });
  }
};

// get acount history from history model 
exports.getAccountsHistoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getHistoryByIdService(id);

    res.status(200).json({
      status: "success",
      message: "account hisotries",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};



exports.updateAccountBalanceById = async (req, res) => {
  try {
    const id = req.params.id;
    const { amount, historyTitle, bgColor } = req.body;

    if (!historyTitle) {
      return res.status(200).json({
        status: "fail",
        message: "Update note is required",
      });
    }

    const originalDocument = await AccountsModel.findOne({ _id: id });
    if (amount < 0) {
      return res.status(200).json({
        status: "fail",
        message: "Amount Not Updated! Please provide valid amount.",
      });
    }

    const result = await updateAccountBalanceByIdService(id, { amount: amount, historyTitle, bgColor });

    res.status(200).json({
      status: "success",
      message: 'Balance Updated Successfully.',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Balance Updated Accounts Failed!",
      error: error.message,
    });
  }
};


// here balance transfer to money account to another account
exports.balanceTransferUpdate = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, transferAmount } = req.body;
    if (fromAccountId === toAccountId) {
      return res.status(200).json({
        status: 'fail',
        message: 'You cannot transfer data from the same account to the same account '
      })
    }


    if (!mongoose.isValidObjectId(fromAccountId) || !mongoose.isValidObjectId(toAccountId)) {
      return res.status(200).json({
        status: 'fail',
        message: 'Your Account id invalid'
      })
    }

    // check and find amount from account collection



    const fromAccountData = await AccountsModel.findOne({ _id: fromAccountId })
    if (!fromAccountData) {
      return res.status(200).json({
        status: 'fail',
        message: 'Account not found, please provide valid id'
      })
    }
    const toAccountData = await AccountsModel.findOne({ _id: toAccountId })
    if (!toAccountData) {
      return res.status(200).json({
        status: 'fail',
        message: 'Account not found, please provide valid id'
      })
    }

    // amount of fromAccount and toAccount
    const { amount: fromAmount, _id: fromId } = fromAccountData
    const { amount: toAmount, _id: toId } = toAccountData

    // ekhane 2ta kaj hobe, fromAcount er koto amount uni toAccount a transfer korte cay, seta deya laagbe
    // and from account er moddhe ekta history rakha laagbe and toAccount er moddhe ekta history rakha laagbe
    //from account er history: balance Transfer:500 taka transfer to bkash Account
    // to account er history:Balance Transfer: 500 tk recevied from ific account 

    // update toAccount minus given amount
    if (fromAccountData.amount < transferAmount) {
      return res.status(200).json({
        status: 'fail',
        message: 'have not sufficient balance for transfer balance'
      })
    }

    const resultOfFromAccount = await AccountsModel.findOneAndUpdate({ _id: fromAccountData._id }, { amount: fromAccountData.amount - transferAmount }, { upsert: false, new: true });
    if (resultOfFromAccount) {
      await createHistory({
        historyTitle: `Balance Transfer: ${transferAmount} taka transfer to ${toAccountData.accountName} Account`,
        historyAmount: transferAmount,
        currentAccountBalance: resultOfFromAccount.amount,
        historyParentAccount: fromAccountData._id
      })
    }
    /* 
    history er moddhe ekta change asbe, jodi balance tranfer hoy, historAmount er moddhe thakbe transfer balance amount 
    and currentAcountBalnace er moddhe thakbe, balance tranfer howyar por bortoman koto taka ache, card er moddhe dekhate hobe,
    jodi currentAccountBalnace thake tobe dekhabe, na thakle dekhabe na
     */
    const resultOfToAccount = await AccountsModel.findOneAndUpdate({ _id: toAccountData._id }, { amount: toAccountData.amount + transferAmount }, { upsert: false, new: true });
    if (resultOfToAccount) {
      await createHistory({
        historyTitle: `Balance Received: ${transferAmount} taka Received from ${fromAccountData.accountName} Account`,
        historyAmount: transferAmount,
        currentAccountBalance: resultOfToAccount.amount,
        historyParentAccount: toAccountData._id
      })
    }

    if (resultOfFromAccount && resultOfToAccount) {
      res.status(200).json({
        status: "success",
        message: 'Balance transfer Successfully.',
        data: '',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Balance Updated Accounts Failed!",
      error: error.message,
    });
  }
};

