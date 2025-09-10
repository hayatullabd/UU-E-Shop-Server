const MyShop = require("../Models/myShopModel");
const {
  getMyShopService,
  createMyShopService,
  getMyShopByIdService,
  updateMyShopByIdService,
  deleteMyShop,
} = require("../services/myShopServices");

exports.getMyShop = async (req, res) => {
  try {
    const result = await MyShop.findOne();
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

exports.createMyShop = async (req, res) => {
  try {
    const newMyShop = await createMyShopService(req.body);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: newMyShop,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getMyShopById = async (req, res) => {
  try {
    const id = req.params.id;
    const MyShop = await getMyShopByIdService(id);

    res.status(200).json({
      status: "success",
      data: MyShop,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteMyShopById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteMyShop(id);

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

exports.updateMyShopById = async (req, res) => {
  try {
    const id = req.params.id;
    const MyShop = await updateMyShopByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      message: "updated done",
      data: MyShop,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.updateShop = async (req, res) => {
  const email = req.body.email;
  try {


    if (!email) {
      return res.status(200).json({
        status: "fail",
        message: "email is not empty",
      });
    }

    const id = req.query.uid;
    let myshop = ''
    if (id) {
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      myshop = await MyShop.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        options
      );
    } else {
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      myshop = await MyShop.findOneAndUpdate(
        { email: email },
        { $set: req.body },
        options
      );
    }


    res.status(200).json({
      status: "success",
      message: "Shop Details Updated",
      data: myshop,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
