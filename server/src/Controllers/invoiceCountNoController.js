const InvoiceNumber = require("../Models/invoiceCountNoModel");
const Product = require("../Models/ProductModal");
const {
  getInvoiceNumberService,
  createInvoiceNumberService,
  getInvoiceNumberByIdService,
  updateInvoiceNumberByIdService,
  deleteInvoiceNumber,
} = require("../services/invoiceCountNoService");

exports.getInvoiceNumber = async (req, res) => {
  try {
    let filters = { ...req.query };
    const excludesFields = ["limit", "page", "sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { childInvoiceNumber: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipInvoiceNumber = (page - 1) * +limit;
      queries.skip = skipInvoiceNumber;
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
      let selectInvoiceNumber = req.query.fields.split(",").join(" ");
      queries.fields = selectInvoiceNumber;
    }

    const result = await getInvoiceNumberService(filters, queries);

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

exports.createInvoiceNumber = async (req, res) => {
  try {
    const newInvoiceNumber = await createInvoiceNumberService(req.body);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: newInvoiceNumber,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getInvoiceNumberById = async (req, res) => {
  try {
    const id = req.params.id;
    const InvoiceNumber = await getInvoiceNumberByIdService(id);

    res.status(200).json({
      status: "success",
      data: InvoiceNumber,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteInvoiceNumberById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteInvoiceNumber(id);

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
      data: result,
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

    const ids = await body.map((item) => item._id); // Extract the product IDs from the request body

    let totalPrice = [];
    const productSaleAndOriginalPrice = await Product.find(
      { _id: { $in: ids } },
      "salePrice productPrice"
    ); // Query the database for the salePrice field of the matching products

    let totalSalePrice = 0;
    let totalOriginalPrice = 0;

    const result = productSaleAndOriginalPrice.forEach((product) => {
      body.forEach((bd) => {
        if (product._id == bd._id) {
          totalSalePrice += product.salePrice * bd.quantity;
          totalOriginalPrice += product.productPrice * bd.quantity;
        }
      });
    });

    res.status(200).json({
      status: "success",
      data: {
        cartTotal: totalSalePrice,
        originalProductPrice: totalOriginalPrice,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateInvoiceNumberById = async (req, res) => {
  try {
    const id = req.params.id;
    const InvoiceNumber = await updateInvoiceNumberByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      data: InvoiceNumber,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.incrementOneAndGet = async (req, res) => {
  try {
    const result = await InvoiceNumber.findOneAndUpdate(
      {
        _id: "6426e3f7fead0509ab03cfbe", // change the _id value to match the document's _id in the database
      },
      { $inc: { invoiceNumber: 1 } },
      { new: true }
    );
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
