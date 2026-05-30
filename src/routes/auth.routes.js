const express = require("express");
const { registerController } = require("../controllers/auth.controller");

const authRouter = express.Router();

/*
POST /api/auth/register
*/
authRouter.post("/register", registerController);

module.exports = authRouter;
