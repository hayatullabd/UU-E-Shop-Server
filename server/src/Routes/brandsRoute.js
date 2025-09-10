const express = require("express");
const {
  getBrands,
  createBrands,
  getBrandsById,
  updateBrandsById,
  deleteBrandsById,
} = require("../Controllers/brandsController");

const router = express.Router();

router.route("/").get(getBrands).post(createBrands);
router
  .route("/:id")
  .get(getBrandsById)
  .delete(deleteBrandsById)
  .patch(updateBrandsById);

module.exports = router;
