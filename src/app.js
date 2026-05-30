const express = require("express");
const morgan = require("morgan");
const authRouter = require("./routes/auth.routes");

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRouter);

module.exports = app;
