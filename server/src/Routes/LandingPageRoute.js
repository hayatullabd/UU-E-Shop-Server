const express = require("express");
const {
  getLandingPage,
  createLandingPage,
  getLandingPageById,
  updateLandingPageById,
  deleteLandingPageById,
} = require("../Controllers/LandingPageController");

const router = express.Router();

router.route("/").get(getLandingPage).post(createLandingPage);
router
  .route("/:id")
  .get(getLandingPageById)
  .delete(deleteLandingPageById)
  .patch(updateLandingPageById);

module.exports = router;
