const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sessionModel = require("../models/session.model");

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

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "user created successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(401).json({
      message: "invalid email",
    });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({
      message: "invalid password",
    });

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

async function getMeController(req, res) {
  const accessToken = req.headers?.authorization?.split(" ")[1];

  if (!accessToken)
    return res.status(401).json({
      message: "token not found",
    });

  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const userData = await userModel.findById(decoded.id).select("-password");

  res.status(200).json({
    message: "user fetched successfully",
    userData,
  });
}

async function refreshTokenController(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({
      message: "refresh token not found",
    });
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session)
    return res.status(401).json({
      message: "invalid refresh token",
    });

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");
  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  const accessToken = jwt.sign(
    {
      id: decoded.id,
      sessionId: session._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m",
    },
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "access token refreshed succesfully",
    accessToken,
  });
}

async function logoutController(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(400).json({
      message: "refresh token not found",
    });

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session)
    return res.status(400).json({
      message: "invalid refresh token",
    });

  session.revoked = true;
  await session.save();

  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "logged out successfully",
  });
}

async function logoutAllController(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(400).json({
      message: "Refresh token not found",
    });

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  await sessionModel.updateMany(
    {
      userId: decoded.id,
      revoked: false,
    },
    {
      revoked: true,
    },
  );
  res.clearCookie("refreshToken");
  res.status(200).json({
    message: "logged out from all devices",
  });
}

module.exports = {
  registerController,
  loginController,
  getMeController,
  refreshTokenController,
  logoutController,
  logoutAllController,
};
