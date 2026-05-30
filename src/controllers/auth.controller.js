const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered)
    return res.status(409).json({
      message: "username or email are already register, please login",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.jwt_secret,
    {
      expiresIn: "1d",
    },
  );

  res.status(201).json({
    message: "user created successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    token,
  });
}

module.exports = {
  registerController,
};
