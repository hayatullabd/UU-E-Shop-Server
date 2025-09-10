const csv = require("fast-csv");
const InvoiceNumber = require("../Models/invoiceCountNoModel");
const Product = require("../Models/ProductModal");
const {
  getOrderService,
  createOrderService,
  getOrderByIdService,
  updateOrderByIdService,
  deleteOrder,
} = require("../services/orderService");
const Order = require("../Models/orderModel");
const User = require("../Models/userModel");
const {
  getUserByIdService,
  getUserByEmailService,
} = require("../services/userService");
const Variant = require("../Models/variantModel");

exports.getOrder = async (req, res) => {
  try {
    let filters = { ...req.query };
    const excludesFields = [
      "limit",
      "page",
      "sort",
      "fields",
      "search",
      "startDate",
      "endDate",
    ];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          {
            invoiceNumber: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            "shippingAddress.phone": {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      };
    }
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);

      startDate.setHours(0, 0, 0, 0);
      // Reset time to the end of the day for endDate
      endDate.setHours(23, 59, 59, 999);

      filters = {
        createdAt: { $gte: startDate, $lte: endDate },
      };
    }

    // sort-----------

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipOrder = (page - 1) * +limit;
      queries.skip = skipOrder;
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
      let selectOrder = req.query.fields.split(",").join(" ");
      queries.fields = selectOrder;
    }

    const result = await getOrderService(filters, queries);

    res.status(200).json({
      status: "success",
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

/* exports.createOrder = async (req, res) => {
  try {
    const data = req.body;
    if (!data.orderItem) {
      return res.status(200).json({
        status: "fail",
        message: "please select some product",
      });
    }
    const result = await InvoiceNumber.findOneAndUpdate(
      {
        _id: "6426e3f7fead0509ab03cfbe", // change the _id value to match the document's _id in the database
      },
      { $inc: { invoiceNumber: 1 } },
      { new: true }
    );
    data.invoiceNumber = result.invoiceNumber;

    // here increase product sale count for each order item product
    const idsAndQuantity = data.orderItem.map((item) => {
      return { id: item.product, quantity: item.quantity };
    });

    const newOrder = await createOrderService(data);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: newOrder,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
}; */

// ----------------------
exports.createOrder = async (req, res) => {
  try {
    const data = req.body;

    if (!data.user) {
      const { phone, firstName, address } = data.shippingAddress;
      let userByEmail = await getUserByEmailService(`${phone}@email.com`);

      if (!userByEmail) {
        const newUser = new User({
          phone,
          fullName: firstName,
          address,
          status: "active",
          role: "user",
          password: "123457",
          confirmPassword: "123457",
          email: `${phone}@email.com`,
        });
        const savedUser = await newUser.save();
        data.user = savedUser._id;
      } else {
        data.user = userByEmail._id;
      }
    }

    // Validate order items
    if (!data.orderItem || data.orderItem.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "please select some product",
      });
    }

    // Increment invoice number atomically
    const result = await InvoiceNumber.findOneAndUpdate(
      { _id: "6426e3f7fead0509ab03cfbe" },
      { $inc: { invoiceNumber: 1 } },
      { new: true, upsert: true }
    );
    data.invoiceNumber = result.invoiceNumber;

    // Update product sale count and stock quantity in parallel
    const productUpdates = data.orderItem.map(async (item) => {
      return Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            saleCount: item.quantity,
            quantity: -item.quantity,
          },
        },
        { new: true }
      );
    });

    // Update variant stock quantity in parallel
    const variantUpdates = data.orderItem.map(async (item) => {
      return Variant.findByIdAndUpdate(
        item.variant,
        {
          $inc: {
            quantity: -item.quantity,
          },
        },
        { new: true }
      );
    });

    await Promise.all([...productUpdates, ...variantUpdates]);


    // Create the order
    const newOrder = await createOrderService(data);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: newOrder,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted",
      error: error.message,
    });
  }
};

exports.cancelOrderMangeStock = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(200).json({
        status: "fail",
        message: "please select some product",
      });
    }

    // increase product sale count and decrease product stock quantity for each order item product
    for (const item of data) {
      const product = await Product.findById(item.product);
      if (product) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              saleCount: -item.quantity * 1,
              quantity: item.quantity * 1,
            },
          },
          { new: true }
        );
      }
    }

    for (const item of data.orderItem) {
      const variant = await Variant.findById(item.variant);
      if (variant) {
        await Variant.findByIdAndUpdate(
          item.variant,
          {
            $inc: {
              quantity: item.quantity * 1,
            },
          },
          { new: true }
        );
      }
    }

    res.status(200).json({
      status: "",
      message: "Update Stock",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

// ----------------------

exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const Order = await getOrderByIdService(id);

    res.status(200).json({
      status: "success",
      data: Order,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await getOrderByIdService(id);

    if (order?.status === "pending" || order?.status === "processing") {
      if (order?.walletAmount) {
        if (order.user) {
          await User.findByIdAndUpdate(
            order?.user?._id,
            {
              $inc: {
                padding_wallet: - order?.walletAmount || 0,
              },
            },
            { new: true }
          );
        }
      }
    }


    const result = await deleteOrder(id);

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
      data:result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.getTotalPriceOfCarSelection = async (req, res) => {
  try {
    const body = req.body;
    /*     const productIds = await bodyProductIdAndQuantity.map((item) =>
      ObjectId(item.id)
    );

    const products = await Product.find({ _id: { $in: productIds } }).select(
      "salePrice"
    );
 */

    const ids = await body.map((item) => item.id); // Extract the product IDs from the request body
    let total;
    let totalPrice = [];
    const result = await Product.find({ _id: { $in: ids } }, "salePrice"); // Query the database for the salePrice field of the matching products

    const pd = result.forEach((product) => {
      body.forEach((bd) => {
        if (product._id == bd.id) {
          let total = product.salePrice * bd.quantity;
          totalPrice.push(total);
        }
      });
    });

    res.status(200).json({
      status: "total price of cart items",
      data: totalPrice.reduce((x, y) => x + y),
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = req.body;

    const Order2 = await getOrderByIdService(id);

    if (data?.status === "delivered") {
      await User.findByIdAndUpdate(
        Order2?.user?._id,
        {
          $inc: {
            padding_wallet: -(Order2?.walletAmount ? Order2?.walletAmount : 0),
            wallet: Order2?.walletAmount ? Order2?.walletAmount : 0,
          },
        },
        { new: true }
      );
    }

    if (data?.status === "pending") {
      if (Order2?.status === "delivered") {
        await User.findByIdAndUpdate(
          Order2?.user?._id,
          {
            $inc: {
              padding_wallet: Order2?.walletAmount ? Order2?.walletAmount : 0,
              wallet: -(Order2?.walletAmount ? Order2?.walletAmount : 0),
            },
          },
          { new: true }
        );
      }
    }

    if (data?.status === "processing") {
      if (Order2?.status === "delivered") {
        await User.findByIdAndUpdate(
          Order2?.user?._id,
          {
            $inc: {
              padding_wallet: Order2?.walletAmount ? Order2?.walletAmount : 0,
              wallet: -(Order2?.walletAmount ? Order2?.walletAmount : 0),
            },
          },
          { new: true }
        );
      }
    }

    // if (data?.status === "cancelled") {
    //   if (Order2?.status === "delivered") {
    //     await User.findByIdAndUpdate(
    //       Order2?.user?._id,
    //       {
    //         $inc: {
    //           wallet: -(Order2?.walletAmount ? Order2?.walletAmount : 0),
    //         },
    //       },
    //       { new: true }
    //     );
    //   } else {
    //     await User.findByIdAndUpdate(
    //       Order2?.user?._id,
    //       {
    //         $inc: {
    //           padding_wallet: -(Order2?.walletAmount
    //             ? Order2?.walletAmount
    //             : 0),
    //         },
    //       },
    //       { new: true }
    //     );
    //   }
    // }

    const Order = await updateOrderByIdService(id, req.body);
    res.status(200).json({
      status: "success",
      message: "order update success",
      data: Order,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "internal error",
      error: error.message,
    });
  }
};

exports.updateUserOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    const Order = await getOrderByIdService(id);

    if (!Order) {
      res.status(200).json({
        status: "success",
        message: "Order Not found",
      });
    }

    const OrderData = await updateOrderByIdService(id, req.body);

    if (OrderData) {
      const update = await User.findByIdAndUpdate(
        req.body.user,
        {
          $inc: {
            padding_wallet: Order?.walletAmount,
          },
        },
        { new: true }
      );

      console.log(update);
    }

    res.status(200).json({
      status: "success",
      message: "order update success",
      data: Order,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "internal error",
      error: error.message,
    });
  }
};

exports.exportOrders = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).lean();

    const modifiedOrders = orders.map((order) => {
      return {
        invoiceNumber: order.invoiceNumber,
        shippingAddress: order.shippingAddress.address,
        phone: order.shippingAddress.phone,
        amount: order.totalAmount + ".00Tk",
        action: order.status,
        date: new Date(order.createdAt).toLocaleString(),
      };
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");

    csv
      .writeToStream(res, modifiedOrders, {
        headers: true,
        encoding: "utf8", // Specify the encoding as UTF-8
      })
      .on("error", (error) => {
        throw error;
      })
      .on("finish", () => {
        res.end();
      });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
