const express = require("express");
const { registerController, getMe,refreshToken } = require("../controllers/auth.controller");

const authRouter = express.Router();

/*
POST /api/auth/register
*/
authRouter.post("/register", registerController);

/*
GET /api/auth/get-me
*/
authRouter.get('/get-me', getMe)

/*
GET /api/auth/refresh-token
*/
authRouter.get('/refresh-token', refreshToken)


module.exports = authRouter;
