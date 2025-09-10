const { ObjectId } = require("mongodb");
const DeliveryCost = require("../Models/deliveryModel");
const OtherCityShippingCost = require("../Models/otherCityShippingCostModel");
const Product = require("../Models/ProductModal");
const {
  getDeliveryCostService,
  createDeliveryCostService,
  getDeliveryCostByIdService,
  updateDeliveryCostByIdService,
  deleteDeliveryCost,
} = require("../services/deliveryCostService");

exports.getDeliveryCost = async (req, res) => {
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
          { childDeliveryCost: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipDeliveryCost = (page - 1) * +limit;
      queries.skip = skipDeliveryCost;
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
      let selectDeliveryCost = req.query.fields.split(",").join(" ");
      queries.fields = selectDeliveryCost;
    }

    const result = await getDeliveryCostService(filters, queries);

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

exports.createDeliveryCost = async (req, res) => {
  try {
    const result = await createDeliveryCostService(req.body);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};
// -------------------this is post api for others city
exports.createOthersCityShippingCost = async (req, res) => {
  try {
    const result = await OtherCityShippingCost.create(req.body);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getDeliveryCostById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getDeliveryCostByIdService(id);

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
exports.deleteDeliveryCostById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteDeliveryCost(id);

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

exports.updateDeliveryCostById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await updateDeliveryCostByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      message: "Cost Added Done",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
// ----------its for update others city update shipping cost----------
exports.updateOthersCityShippingCost = async (req, res) => {
  try {
    const result = await OtherCityShippingCost.updateOne(
      { _id: "64288bc927169612c332ebb6" },
      req.body
    );

    res.status(200).json({
      status: "success",
      message: "shipping cost updated",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getOthersCityShippingCost = async (req, res) => {
  try {
    const result = await OtherCityShippingCost.findById(
      "64288bc927169612c332ebb6"
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
exports.getShippingCostForUser = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      throw new Error("City is required");
    }

    const deliveryCost = await DeliveryCost.findOne({ city });

    if (deliveryCost) {
      return res.status(200).json({
        status: "success",
        data: { cost: deliveryCost.cost },
      });
    }

    const otherCityShippingCosts = await OtherCityShippingCost.find({});

    if (!otherCityShippingCosts.length) {
      throw new Error("Other city shipping costs not found");
    }

    return res.status(200).json({
      status: "success",
      data: { cost: otherCityShippingCosts[0].otherCityCost },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateDeliveryCost = async (req, res) => {
  try {

    const id = req.query.did;

    

    let myshop = ''
    if (id) {
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      myshop = await DeliveryCost.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        options
      );
    } 
    // else {
    //   const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    //   myshop = await DeliveryCost.findOneAndUpdate(
    //     { email: email },
    //     { $set: req.body },
    //     options
    //   );
    // }


    res.status(200).json({
      status: "success",
      message: "Delivery Cost Updated",
      data: myshop,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};