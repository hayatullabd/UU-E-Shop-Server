const Product = require("../Models/ProductModal");
const mergeTwoArrayWithOutSameValue = require("../utils/mergeTwoArrayWithOutSameValue");

/* exports.getProductsService = async (filters, queries) => {
  const products = await Product.find(filters).populate("variant")
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sort);

  const total = await Product.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);
  return { total, page, products };
}; */
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
// old code
/* exports.getProductsInterestedService = async (filters) => {
  const products = await Product.find(filters).populate("variant");
  const allProduct = await Product.find({ status: true }).populate("variant");
  const category = products[0].category;
  let interestedProduct = [];
  if (category) {
    interestedProduct = await Product.find({ category: category, status: true }).limit(5).populate("variant");
  }
  const result = mergeTwoArrayWithOutSameValue(allProduct, interestedProduct);
  const total = result.length;
  return { total, result };
}; */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

exports.getProductsInterestedService = async (filters, page = 1, limit = 10) => {
  // Step 1: Fetch products based on filters
  const products = await Product.find(filters)
    .populate("variant")
    .skip((page - 1) * limit)
    .limit(limit);

  // Step 2: Shuffle the products array
  const shuffledProducts = shuffleArray(products);

  // Step 3: Count total number of filtered products
  const totalProducts = await Product.countDocuments(filters);

  // Step 4: Return the total count and paginated, shuffled products
  return {
    total: totalProducts,
    result: shuffledProducts,
  };
};


exports.createProductService = async (data) => {
  const product = await Product.create(data);
  return product;
};

exports.getProductByIdService = async (id) => {
  const product = await Product.findById(id).populate("variant");
  return product;
};

exports.deleteProductByIdService = async (id) => {
  const result = await Product.deleteOne({ _id: id });
  return result;
};
exports.updateProductByIdService = async (id, body) => {
  const result = await Product.updateOne({ _id: id }, body);
  return result;
};

// exports.addProductIdToBrandService = async (query, productId) => {
//     const result = await Brand.update(
//       { _id: query },
//       { $push: { products: productId } }
//     )
//     return result;
//   }
