const express = require("express");
const {
  getAccounts,
  AddOpeningBalance,
  getAccountsHistory,
  getAccountsHistoryById,
  updateAccountBalanceById,
  balanceTransferUpdate
} = require("../Controllers/AccountsController.js");
const router = express.Router();

router.route('/opening-balance').get(getAccounts).post(AddOpeningBalance)
router.route('/balance-transfer').patch(balanceTransferUpdate)

// here account update and post new history
router.route('/opening-balance/:id').patch(updateAccountBalanceById)

// hisotry of any acount history
router.route('/account-history').get(getAccountsHistory)

router.route('/account-history/:id').get(getAccountsHistoryById)
/* 
router.route("/").get(getAccounts).post(createProduct).delete().patch()
router.route("/").get(getAccounts).post(createProduct).delete().patch();
router.route("/user-interested-product").get(getUserInterestedAccounts);
router.route("/export-product").get(exportAccounts);

router
  .route("/:id")
  .get(getProductById)
  .delete(deleteProductController)
  .patch(updateProductByIdCotnroller);
 */

module.exports = router;
