const express = require("express");
const adminVerify = require("../middlewere/adminVerify");
const { createReviews, getAdminReview, getReview, updateReview, deleteReview } = require("../Controllers/reviewController");

const router = express.Router();

router.post("/create/:id",createReviews);
router.get("/get-admin",getAdminReview);
router.get("/get/:id",getReview);
router.patch("/update/:id",updateReview);
router.delete("/delete/:id",deleteReview);

module.exports = router;