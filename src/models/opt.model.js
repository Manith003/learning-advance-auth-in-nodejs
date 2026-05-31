const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, "email is required"] },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user is required"],
    },
    optHash: {
      type: String,
      required: [true, "OPT hash is required"],
    },
  },
  {
    timestamps: true,
  },
);

const otpModel = mongoose.model("opts", otpSchema);

module.exports = otpModel;
