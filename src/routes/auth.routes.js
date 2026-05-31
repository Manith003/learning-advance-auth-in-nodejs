const express = require("express");
const {
  registerController,
  loginController,
  getMeController,
  refreshTokenController,
  logoutController,
  logoutAllController,
  verifyEmailController
} = require("../controllers/auth.controller");

const authRouter = express.Router();

/*
POST /api/auth/register
*/
authRouter.post("/register", registerController);

/*
POST /api/auth/login
*/
authRouter.post("/login", loginController);

/*
GET /api/auth/get-me
*/
authRouter.get("/get-me", getMeController);

/*
GET /api/auth/refresh-token
*/
authRouter.get("/refresh-token", refreshTokenController);

/*
GET /api/auth/logout
*/
authRouter.get("/logout", logoutController);

/*
GET /api/auth/logoutAll
*/
authRouter.get("/logout-all", logoutAllController);

/*
GET /api/auth/verify-email
*/
authRouter.get('/verify-email', verifyEmailController)

module.exports = authRouter;
