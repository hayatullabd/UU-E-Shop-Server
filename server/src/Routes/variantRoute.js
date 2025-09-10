const express = require("express");
const { createBanner, updateVariant, deleteVariant } = require("../Controllers/variantControlle");

const router = express.Router();

router.post("/create/:id",createBanner);
router.patch("/update/:id",updateVariant);
router.delete("/delete/:proId/:id",deleteVariant);

module.exports = router;
