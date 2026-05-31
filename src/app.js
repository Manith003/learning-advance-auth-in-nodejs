const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const authRouter = require("./routes/auth.routes");
const cp = require("cookie-parser");

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cp());

//routes
app.use("/api/auth", authRouter);

module.exports = app;
