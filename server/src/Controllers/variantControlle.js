const Variant = require("../Models/variantModel");
const Product = require("../Models/ProductModal");

exports.createBanner = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      res.status(403).json({
        status: "fail",
        message: "Product Not Found",
      });
    }

    const variant = await Variant.create(req.body);

    // if (product) {
    //   product.quantity += req.body.quantity;
    // }

    await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          variant: variant?._id,
        },
        $inc: {
          quantity: req.body.quantity,
        },
      },
      { new: true }
    );

    // await product.save();

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: variant,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.updateVariant = async (req, res, next) => {
  try {
    const id = req.params.id;

    const variant = await Variant.findById(id);

    if (!variant) {
      res.status(400).json({
        status: "fail",
        message: "variant not found",
      });
    }

    const update = await Variant.findByIdAndUpdate(id,{
      $set:{
        buyingPrice:req.body.buyingPrice,
        size:req.body.size,
        discount:req.body.discount,
        salePrice:req.body.salePrice,
        productPrice:req.body.productPrice,
      },
      $inc:{
        quantity:req.body.quantity,
      }
    }, {
      new: true,
    });


    await Product.findByIdAndUpdate(
      req.body.productId,
      {
        $inc: {
          quantity: req.body.quantity,
        },
      },
      { new: true }
    );


    res.status(200).json({
      status: "success",
      message: "Update successfully!",
      data: update,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.deleteVariant = async (req, res, next) => {
  try {
    const id = req.params.id;
    const proId = req.params.proId;

    const variant = await Variant.findById(id);

    if (!variant) {
      res.status(400).json({
        status: "fail",
        message: "variant not found",
      });
    }

    const result = await Variant.deleteOne({ _id: id });

    if (result) {
      await Product.findByIdAndUpdate(
        proId,
        {
          $inc: {
            quantity: -variant?.quantity,
          },
        },
        { new: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Delete successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};
