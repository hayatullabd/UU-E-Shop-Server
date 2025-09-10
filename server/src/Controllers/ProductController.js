const csv = require("fast-csv");

const {
  // getProductsService,
  createProductService,
  updateProductByIdService,
  deleteProductByIdService,
  getProductsInterestedService,
} = require("../services/productServices");
const Product = require("../Models/ProductModal");
const Variant = require("../Models/variantModel");


// Controller Function
exports.getProducts = async (req, res) => {
  try {
    console.log("from product", req.query)
    let filters = { ...req.query };
    const excludeFields = ["limit", "page", "sort", "fields", "search", "subCategory"];
    excludeFields.forEach((field) => delete filters[field]);

    // Search functionality
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: "i" };
      filters.$or = [
        { name: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    // Subcategory filtering
    if (req.query.subCategory) {
      filters.subCategory = { $in: req.query.subCategory };
    }

    // Query operators for range filtering
    let filterString = JSON.stringify(filters);
    filterString = filterString.replace(/\b(gt|lt|gte|lte)\b/g, (match) => `$${match}`);
    filters = JSON.parse(filterString);

    // Query options
    const queries = {};

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;
    queries.skip = skip;
    queries.limit = limit;

    // Sorting
    if (req.query.sort) {
      queries.sort = req.query.sort.split(",").join(" ");
    }

    // Field selection
    if (req.query.fields) {
      queries.fields = req.query.fields.split(",").join(" ");
    }

    // Fetch products
    const result = await getProductsService(filters, queries);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "An error occurred while retrieving the data",
      error: error.message,
    });
  }
};

// Service Function
const getProductsService = async (filters, queries) => {
  try {
    // Execute both queries in parallel
    const [products, total] = await Promise.all([
      Product.find(filters)
        .populate("variant")
        .skip(queries.skip)
        .limit(queries.limit)
        .select(queries.fields)
        .sort(queries.sort),
      Product.countDocuments(filters),
    ]);

    const page = Math.ceil(total / queries.limit);
    return { total, page, products };
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};


/* exports.getUserInterestedProducts = async (req, res) => {
  try {
    const interest = req.query;
    let filters = { ...req.query };
    const excludesFields = [
      "limit",
      "page",
      "sort",
      "fields",
      "search",
      "interest",
    ];

    excludesFields.forEach((field) => {
      delete filters[field];
    });

    let queries = {};

    if (req.query.interest) {
      // let oldFilters = filters;
      filters = {
        $or: [
          { name: { $regex: req.query.interest, $options: "i" } },
          { category: { $regex: req.query.interest, $options: "i" } },
          { tags: { $regex: req.query.interest, $options: "i" } },
        ],
      };
    }

    const result = await getProductsInterestedService(filters);
    // here i got interested product
    //now interested product with another remaining all product make a array and send response
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
 */

exports.getUserInterestedProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, interest, ...filters } = req.query;

    // Exclude specific fields from filters
    const excludesFields = ["limit", "page", "sort", "fields", "search", "interest"];
    excludesFields.forEach((field) => delete filters[field]);

    // Add search functionality for interest
    if (interest) {
      filters.$or = [
        { name: { $regex: interest, $options: "i" } },
        { category: { $regex: interest, $options: "i" } },
        { tags: { $regex: interest, $options: "i" } },
      ];
    }
    filters.status = true;
    const { total, result } = await getProductsInterestedService(filters, page, limit);

    res.status(200).json({
      status: "success",
      total,
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

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await createProductService(req.body);

    console.log(newProduct);

    if (newProduct) {
      const data = {
        product_id: newProduct?._id,
        quantity: req.body.quantity,
        buyingPrice: req.body.buyingPrice,
        productPrice: req.body.productPrice,
        salePrice: req.body.salePrice,
        discount: req.body.discount,
      };
      const dd = await Variant.create(data);

      if (dd) {
        await Product.findByIdAndUpdate(
          newProduct?._id,
          {
            $push: {
              variant: dd?._id,
            },
          },
          { new: true }
        );
      }
    }

    res.status(200).json({
      status: "success",
      message: "Product Create successfully!",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data is not inserted ",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    console.log(id);

    const product = await getProductByIdService(id);

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const getProductByIdService = async (id) => {
  let retries = 3;
  while (retries) {
    try {
      const product = await Product.findById(id).populate("variant");
      return product;
    } catch (error) {
      retries -= 1;
      if (retries === 0) throw error;
      console.log(`Retrying... ${3 - retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }
};


exports.deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await deleteProductByIdService(id);

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "filad to product delete",
      error: error.message,
    });
  }
};
exports.updateProductByIdCotnroller = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const product = await updateProductByIdService(id, body);

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "filad to update product",
      error: error.message,
    });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const query = req.params.id;
    const product = await updateProductByIdService(id);

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};


exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    const modifiedProducts = products.map((product) => {
      return {
        ...product,
        subCategory: product.subCategory
          ? JSON.stringify(product.subCategory)
          : "[]",
        productColor: product.productColor
          ? JSON.stringify(product.productColor)
          : "[]",
        tags: product.tags ? JSON.stringify(product.tags) : "[]",
        imageURLs: product.imageURLs ? JSON.stringify(product.imageURLs) : "[]",
        size: product.size ? JSON.stringify(product.size) : "[]",
      };
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");

    csv
      .writeToStream(res, modifiedProducts, {
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
