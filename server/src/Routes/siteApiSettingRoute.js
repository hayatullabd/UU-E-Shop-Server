const express = require("express");
const {
  updateSiteApiSetting,
  getSiteApiSettingByPostMetodWithSecreateCode,
} = require("../Controllers/siteApiSettingController");
const adminVerify = require("../middlewere/adminVerify");

const router = express.Router();

router.route("/").post(getSiteApiSettingByPostMetodWithSecreateCode);
router.route("/update-site-api-setting").patch(adminVerify,updateSiteApiSetting);



module.exports = router;
