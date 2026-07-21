const express = require("express");

// local module
const { authController } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.get("/login", authController.getLoginPage);
authRouter.post("/login", authController.postLoginDataOfUser);
authRouter.post("/logOut", authController.logout);
authRouter.get("/signup", authController.signup);
authRouter.post(
  "/signup",
  authController.validateSignup,
  authController.postSignup
);

exports.authRouter = authRouter;
