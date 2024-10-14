const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  submittedAnswers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubmittedAnswer",
      required: true,
    },
  ],
  mockTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
  },
  customQueBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomQueBank",
  },
  questionBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionBank",
  },
  preparationTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreparationTest",
  },
  totalCorrect: {
    type: Number,
    default: 0,
  },
  totalIncorrect: {
    type: Number,
    default: 0,
  },
  totalUnattempted: {
    type: Number,
    default: 0,
  },
  skip: {
    type: Number,
    default: 0,
  },
  totalAttempted: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
  timeTaken: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TestResult = mongoose.model("TestResult", testResultSchema);
module.exports = TestResult;
