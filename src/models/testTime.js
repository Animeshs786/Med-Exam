const mongoose = require("mongoose");

const testTimeSchema = new mongoose.Schema({
  testTime: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mockTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
  },
  questionBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionBank",
  },
  preparationTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreparationTest",
  },
  customQueBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomQueBank",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TestTime = mongoose.model("TestTime", testTimeSchema);
module.exports = TestTime;
