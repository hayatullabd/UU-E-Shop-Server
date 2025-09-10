const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const adminVerify = require("../middlewere/adminVerify");
const verifyToken = require("../middlewere/verifyToken");

router.get("/", userController.getUsers);
router.post("/signup", userController.singUp);
router.post("/verify", userController.verifyUser);
router.post("/login", userController.logIn);
router.post("/create-user", userController.createUserFun);
router.get("/me", userController.getMe);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPasswordWithToken);
router.route("/by-email").get(userController.getUserByQuery);
router.patch("/update-many", userController.updateMeny);

router
  .route("/:id")
  .get(userController.getUserById)
  .delete(adminVerify, userController.deleteUser)
  .patch(verifyToken, userController.updateUser);

router.patch("/change-password/:id", userController.changePassword);

module.exports = router;
