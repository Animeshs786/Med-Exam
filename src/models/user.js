const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String },
  mobile: String,
  otp: {
    type: String,
    select: false,
  },
  otpExpiry: Date,
  profileImage: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  collegeName: {
    type: String,
    default: "",
  },
  admissionYear: {
    type: String,
    default: "",
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
  notification: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
