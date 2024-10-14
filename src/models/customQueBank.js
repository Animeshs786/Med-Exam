const mongoose = require("mongoose");

const customQueBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalQuestions: Number,
  testType: {
    type: String,
    enum: ["Preparation", "Mock"],
    default: "Preparation",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CustomQueBank = mongoose.model("CustomQueBank", customQueBankSchema);
module.exports = CustomQueBank;
