const express = require("express");
const {
  getUserDashboard,
  getAdminDashboard,
  getTodayOrders,
  getTotalProfileOfOrders,
} = require("../Controllers/dashboardController");

const router = express.Router();

router.route("/user-dashboard").get(getUserDashboard);
router.route("/admin-dashboard").get(getAdminDashboard);
router.route("/today-orders").get(getTodayOrders);
router.route("/profit").get(getTotalProfileOfOrders);

module.exports = router;
