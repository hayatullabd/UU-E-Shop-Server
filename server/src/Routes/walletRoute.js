const express = require("express");
const adminVerify = require("../middlewere/adminVerify");
const { createWallet, getWallet, getWalletById, deleteWallet, updateWallet, applyWallet } = require("../Controllers/walletController");

const router = express.Router();

router.route("/").get(getWallet).post(createWallet);
router.post("/apply-wallet",applyWallet)

router
  .route("/:id")
  .get(getWalletById)
  .delete(deleteWallet)
  .patch(updateWallet);

module.exports = router;
