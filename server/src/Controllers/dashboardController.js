const { ObjectId } = require("mongodb");
const Order = require("../Models/orderModel");
const Product = require("../Models/ProductModal");
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = ObjectId(req.query.userId);

    const totalOrders = await Order.find({ user: userId });
    const pendingOrders = await Order.find({ user: userId, status: "pending" });
    const processingOrders = await Order.find({
      user: userId,
      status: "processing",
    });
    const completeOrders = await Order.find({
      user: userId,
      status: "delivered",
    });

    res.status(200).json({
      status: "success",
      data: {
        totalOrders: totalOrders.length,
        pendingOrders: pendingOrders.length,
        processingOrders: processingOrders.length,
        completeOrders: completeOrders.length,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

/* exports.getAdminDashboard = async (req, res) => {
  try {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let query = {};

    if (startDate && endDate) {
      query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const totalOrderAmount = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalShippingPrice: { $sum: "$shippingPrice" },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalOrderAmount: totalOrderAmount[0] || {
          totalAmount: 0,
          totalShippingPrice: 0,
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          deliveredOrders: 0,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
}; */
/* exports.getAdminDashboard = async (req, res) => {
  try {
    let totalOrderAmount = {};
    const { startDate, endDate } = req.query;

    if (startDate && endDate) {
      totalOrderAmount = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
            totalShippingPrice: { $sum: "$shippingPrice" },
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
              },
            },
            processingOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "processing"] }, 1, 0],
              },
            },
            deliveredOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
              },
            },
          },
        },
      ]);
    } else {
      totalOrderAmount = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
            totalShippingPrice: { $sum: "$shippingPrice" },
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
              },
            },
            processingOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "processing"] }, 1, 0],
              },
            },
            deliveredOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
              },
            },
          },
        },
      ]);
    }

    res.status(200).json({
      status: "success",
      data: {
        totalOrderAmount: totalOrderAmount[0] || {
          totalAmount: 0,
          totalShippingPrice: 0,
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          deliveredOrders: 0,
          pendingOrdersTotalAmount: 0,
          processingOrdersTotalAmount: 0,
          deliveredOrdersTotalAmount: 0,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
}; */

exports.getAdminDashboard = async (req, res) => {
  try {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let query = {};

    if (startDate && endDate) {
      query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const totalOrderAmount = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalShippingPrice: { $sum: "$shippingPrice" },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          pendingOrdersTotalAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, "$totalAmount", 0],
            },
          },
          processingOrdersTotalAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "processing"] }, "$totalAmount", 0],
            },
          },
          deliveredOrdersTotalAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "delivered"] }, "$totalAmount", 0],
            },
          },
          cancelledOrdersTotalAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, "$totalAmount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalOrderAmount: totalOrderAmount[0] || {
          totalAmount: 0,
          totalShippingPrice: 0,
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          pendingOrdersTotalAmount: 0,
          processingOrdersTotalAmount: 0,
          deliveredOrdersTotalAmount: 0,
          cancelledOrdersTotalAmount: 0,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "can't get the data",
      error: error.message,
    });
  }
};

exports.getTodayOrders = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    let totalTodayOrderAmount = 0;
    todayOrders.forEach((order) => {
      totalTodayOrderAmount += order.totalAmount;
    });

    res.status(200).json({
      status: "success",
      data: {
        todayOrderItems: todayOrders.length,
        totalTodayOrderAmount,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Can't get the data",
      error: error.message,
    });
  }
};

/* exports.getTotalProfileOfOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered" }).populate({
      path: "orderItem.product",
      select: "buyingPrice",
    });

    let totalBuyingPrice = 0;
    let totalAfterDiscountPrice = 0;

    orders.forEach((order) => {
      order.orderItem.forEach((item) => {
        totalBuyingPrice += item.product.buyingPrice * item.quantity;
        totalAfterDiscountPrice += order.afterDiscountPrice;
      });
    });

    res.status(200).json({
      status: "success",
      data: {
        totalBuyingPrice,
        totalAfterDiscountPrice,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Can't get the data",
      error: error.message,
    });
  }
}; */

exports.getTotalProfileOfOrders = async (req, res) => {
  try {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let query = {};

    if (startDate && endDate) {
      query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }
    // get all delivered orders
    const deliveredOrders = await Order.find({ ...query, status: "delivered" });

    if (!deliveredOrders.length) {
      return res.status(200).json({
        status: "success",
        data: {
          totalProfit: 0,
        },
      });
    }

    // get unique product ids and total quantity of each product
    const productIdsAndQuantities = deliveredOrders.reduce((acc, order) => {
      order.orderItem.forEach((item) => {
        const productId = item.product.toString();
        const quantity = item.quantity;
        if (!acc[productId]) {
          acc[productId] = quantity;
        } else {
          acc[productId] += quantity;
        }
      });
      return acc;
    }, {});

    // Get the total profit based on the productIdsAndQuantities object
    let totalSumOfBuyingPrice = 0;
    for (const productId in productIdsAndQuantities) {
      const product = await Product.findById(productId);
      const buyingPrice = product.buyingPrice;
      const quantity = productIdsAndQuantities[productId];
      const revenue = quantity * buyingPrice;
      totalSumOfBuyingPrice += revenue;
    }

    // here total of after order after discount price total
    const totalOrderAmount = await Order.aggregate([
      { $match: { ...query, status: "delivered" } },
      {
        $group: {
          _id: null,
          afterDiscountPrice: { $sum: "$afterDiscountPrice" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const totalProfit =
      totalOrderAmount[0].afterDiscountPrice - totalSumOfBuyingPrice;

    res.status(200).json({
      status: "success",
      data: {
        totalProfit,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Can't get the data",
      error: error.message,
    });
  }
};
