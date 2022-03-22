const express = require("express");
const authController = require("../controller/authController");
const adminController = require("../controller/adminController");
const router = express.Router();

router.route("/signUp").post(authController.signUp);
router.route("/login").post(authController.login);

router.use(authController.protect);

router
  .route("/user")
  .get(adminController.getAllUser)
  .post(adminController.createUser);

router
  .route("/user/:id")
  .get(adminController.getUser)
  .patch(adminController.uploadimage, adminController.updateUser)
  .delete(adminController.deleteUser);

module.exports = router;
