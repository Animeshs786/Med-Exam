const mongoose = require("mongoose");

const questionBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalQuestions: Number,
  instructions: [String],
  minute: Number,
  language: {
    type: String,
    enum: ["Hindi", "English", "Both"],
    default: "English",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  thumbImage: {
    type: String,
    default: "",
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuestionBank = mongoose.model("QuestionBank", questionBankSchema);
module.exports = QuestionBank;
