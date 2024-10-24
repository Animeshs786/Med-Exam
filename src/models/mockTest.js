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
    enum: ["Hindi", "English","Both"],
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
  thumbImage: {
    type: String,
    default: "",
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPaid: {
    type: Boolean,
    default: true,
  },
  reAttempt: {
    type: Boolean,
    default: false,
  },
  testType: {
    type: String,
    enum: ["Full Test", "Subject Test", "Chapter Test"],
    required: true,
  },
  testSeries: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestSeries",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MockTest = mongoose.model("MockTest", mockTestSchema);
module.exports = MockTest;

