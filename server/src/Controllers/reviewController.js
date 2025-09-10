const Review = require("../Models/reviewModel");
const Product = require("../Models/ProductModal");

exports.createReviews = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "couldn't find Product",
      });
    }

    const data = {
      ...req.body,
      product: id,
      productId: id,
    };

    const review = await Review.create(data);

    res.status(200).json({
      status: "success",
      message: "Review Create Success",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const id = req.params.id;

    let filters = { ...req.query };
    const excludesFields = ["limit", "page", "sort", "fields", "search"];

    excludesFields.forEach((field) => {
      delete filters[field];
    });
    if (req.query.search) {
      filters = {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { childBanner: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 5 } = req.query;
      const skipBanner = (page - 1) * +limit;
      queries.skip = skipBanner;
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
      let selectBanner = req.query.fields.split(",").join(" ");
      queries.fields = selectBanner;
    }

    const review = await Review.find({
      product: id,
      status: "active",
    })
      .populate("user").sort(queries.sort)
      .exec();

    res.status(200).json({
      status: "success",
      message: "Review Get Success",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getAdminReview = async (req, res, next) => {
  try {
    const review = await Review.find({ status: "inactive" })
      .populate("product user")
      .exec();

    res.status(200).json({
      status: "success",
      message: "Review Get Success",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found",
      });
    }

    review.status = "active";
    await review.save();

    const findProduct = await Product.findById(review.productId).populate(
      "review"
    );

    if (!findProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    let avg = 0;
    findProduct.review.forEach((rev) => (avg += rev.rating));
    avg = (avg + review.rating) / (findProduct.review.length + 1);

    findProduct.rating = parseFloat(avg.toFixed(1)); // Round to 1 decimal place
    findProduct.review.push(id);

    await findProduct.save();

    res.status(200).json({
      status: "success",
      message: "Review Update Success",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found",
      });
    }

    const reviewDelete = await Review.findByIdAndDelete(id);

    if (reviewDelete) {
      await Product.findByIdAndUpdate(
        review?.productId,
        {
          $pull: {
            review: review?._id,
          },
        },
        { new: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Review Delete Success",
      data: reviewDelete,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
