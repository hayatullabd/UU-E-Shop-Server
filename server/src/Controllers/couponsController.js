const { ObjectId } = require("mongodb");
const Coupons = require("../Models/couponsModel");
const Product = require("../Models/ProductModal");
const {
  getCouponsService,
  createCouponsService,
  getCouponsByIdService,
  updateCouponsByIdService,
  deleteCoupons,
} = require("../services/couponsServices");

exports.getCoupons = async (req, res) => {
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

    const result = await getCouponsService(filters, queries);

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

exports.createCoupons = async (req, res) => {
  try {
    const newCoupons = await createCouponsService(req.body);

    res.status(200).json({
      status: "success",
      message: "data inserted successfully!",
      data: newCoupons,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getCouponsById = async (req, res) => {
  try {
    const id = req.params.id;
    const Coupons = await getCouponsByIdService(id);

    res.status(200).json({
      status: "success",
      data: Coupons,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.deleteCouponsById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteCoupons(id);

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

exports.updateCouponsById = async (req, res) => {
  try {
    const id = req.params.id;
    const Coupons = await updateCouponsByIdService(id, req.body);

    res.status(200).json({
      status: "success",
      message: "updated done",
      data: Coupons,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

// verify coupon and get how much percent discount
exports.couponVerifyAndGetPrice = async (req, res) => {
  try {
    // [id,id,id]

    const body = req.body;

    const couponExist = await Coupons.findOne({ couponCode: body.couponCode });

    if (couponExist.underOfCategory === "all") {
    }
    if (!couponExist) {
      return res.status(200).json({
        status: "fail",
        message: "Invalid Coupon!!",
      });
    }
    // its use for today is coupon code are valid or invalid

    const today = new Date();
    const start = new Date(couponExist.startDate);
    const end = new Date(couponExist.expireDate);
    if (today >= start && today <= end) {
    } else {
      return res.status(200).json({
        status: "fail",
        message: `coupon valid only ${couponExist.startDate} to ${couponExist.expireDate}`,
      }); // expired
    }

    const productIds = await body.productIdAndQuantity.map((pd) => pd.id);
    // find product with product ids
    let products;

    if (couponExist.underOfCategory == "all") {
      products = await Product.find(
        {
          _id: { $in: productIds },
        },
        "salePrice name"
      );
    } else {
      products = await Product.find(
        {
          _id: { $in: productIds },
          $or: [
            { category: couponExist.underOfCategory },
            { subCategory: couponExist.underOfCategory },
          ],
        },
        "salePrice name"
      );
    }

    const totalPrice = body.productIdAndQuantity.reduce(
      (acc, { id, quantity }) => {
        const product = products.find((p) => p._id == id);
        if (product) {
          acc += product.salePrice * quantity;
        }
        return acc;
      },
      0
    );
    if (totalPrice < couponExist.minAmount) {
      /*  return res.status(200).json({
         status: "fail",
         message: `Minimum Buy ${couponExist.minAmount} TK from ${
           couponExist.underOfCategory === "all"
             ? "Any"
             : couponExist.underOfCategory
         } category for this Coupon`,
       });
  */

      return res.status(200).json({
        status: "success",
        message: `Maximum Discount Amount ${couponExist.minAmount}TK. You got ${couponExist.minAmount}TK discount on ${couponExist.underOfCategory === "all"
          ? "Any"
          : couponExist.underOfCategory
          }`,
        data: products,
        discount: couponExist.minAmount,
      });
    }

    const discountTotal = Math.floor(
      (totalPrice / 100) * couponExist.discountPercentage
    );
    res.status(200).json({
      status: "success",
      message: `You got ${discountTotal}TK discount.`,
      data: products,
      discount: discountTotal,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};



// const order = [
//   {
//     title:"hekko",
//     price:200,
//     quantity: 2,
//     underOfSubCategory:"subcategory",
//     underOfCategory:"newCategory"
//   },
//   {
//     title:"hekko",
//     price:200,
//     quantity: 2,
//     underOfSubCategory:"subcategory2",
//     underOfCategory:"newCategory"
//   }
// ]
