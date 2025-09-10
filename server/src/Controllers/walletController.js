const Wallet = require("../Models/walletModel");

exports.createWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.create(req.body);

    res.status(200).json({
      status: "success",
      message:"Wallet create success",
      data: wallet,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getWallet = async (req, res, next) => {
  try {
    let filters = { ...req.query };
    const excludesFields = ["limit", "page", "sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          { couponCode: { $regex: req.query.search, $options: "i" } },
          { campName: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipCoupons = (page - 1) * +limit;
      queries.skip = skipCoupons;
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
      let selectCoupons = req.query.fields.split(",").join(" ");
      queries.fields = selectCoupons;
    }
    /*   // for search---------------------------------
    if (req.query.search) {
      let serachQuery = req.query.search;
      queries.search = serachQuery;
    } */

    const result = await Wallet.find(filters)
      .select(queries.fields)
      .sort(queries.sort);
    const total = await Wallet.countDocuments(filters);

    res.status(200).json({
      status: "success",
      data: { result, total },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.getWalletById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await Wallet.findById(id);

    if (!result) {
      res.status(400).json({
        status: "fail",
        message: "Wallet Not Found",
      });
    }

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateWallet = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await Wallet.findById(id);

    if (!result) {
      res.status(404).json({
        status: "fail",
        message: "Wallet Not Found",
      });
    }

    const update = await Wallet.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({
      status: "success",
      message: "Wallet update success",
      data: update,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.deleteWallet = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await Wallet.findById(id);

    if (!result) {
      res.status(404).json({
        status: "fail",
        message: "Wallet Not Found",
      });
    }

    const update = await Wallet.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Wallet Delete success",
      data: update,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.applyWallet = async (req, res, next) => {
  try {
   
    let totalDiscount2 = 0;

    // Assuming order is received in the request body
    const order = req.body.order;

    // Validate the order
    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid order data"
      });
    }

    // Calculate discount for each item in the order
    for (const item of order) {
      if (!item.price || !item.quantity || !item.category || !item.subCategory) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid item data in order"
        });
      }
      totalDiscount2 += await calculateDiscount(item);
    }

    // Calculate total order price
    const totalOrderPrice = order.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Subtract total discount from the total order price
    const discountedPrice = totalOrderPrice - totalDiscount2;

    

    // Respond with the calculated prices
    res.status(200).json({
      status: "success",
      message: "Wallet discount applied successfully",
      data: { totalOrderPrice, discountedPrice, totalDiscount:Math.floor(totalDiscount2) },
    });
  } catch (error) {
    console.error("Error applying wallet:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

async function calculateDiscount(item) {
  try {
    const discountRule = await Wallet.findOne({
      $or: [
        { underOfCategory: item.category },
        { underOfCategory: item.subCategory }
      ],
      status: "active"
    });

    if (discountRule) {
      const discount = item.price * item.quantity * (discountRule.discountPercentage / 100);

      if (discount < discountRule.minAmount) {
        return discountRule.minAmount;
      } else if (discount > discountRule.maxAmount) {
        return discountRule.maxAmount;
      } else {
        return discount;
      }
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error calculating discount:", error);
    return 0;
  }
}