const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instructions: [String],
  totalQuestions: Number,
  totalMarks: Number,
  minute: Number,
  correctMark: {
    type: Number,
    default: 1,
  },
  wrongMark: {
    type: Number,
    default: 0,
  },
  language: {
    type: String,
    enum: ["Hindi", "English"],
    default: "English",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  thumbImage: String,
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
  price: {
    type: Number,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper",
  },
  testType: {
    type: String,
    enum: ["Full Test", "Subject Test", "Previous Paper"],
    default: "Full Test",
  },
  testSeries: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestSeries",
  },
  previousPaper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreviousPaper",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MockTest = mongoose.model("MockTest", mockTestSchema);
module.exports = MockTest;
