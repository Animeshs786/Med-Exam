const mongoose = require("mongoose");

const preparationTestSchema = new mongoose.Schema({
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
    enum: ["Hindi", "English", "English,Hindi"],
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
  testType: {
    type: String,
    enum: ["Full Test", "Subject Test", "Chapter Test"],
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PreparationTest = mongoose.model(
  "PreparationTest",
  preparationTestSchema
);
module.exports = PreparationTest;
