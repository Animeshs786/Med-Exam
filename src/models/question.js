const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionNameEnglish: {
    type: String,
    trim: true,
    default: "",
  },
  questionNameHindi: {
    type: String,
    trim: true,
    default: "",
  },
  correctAnswerEnglish: {
    type: String,
    trim: true,
    default: "",
  },
  correctAnswerHindi: {
    type: String,
    trim: true,
    default: "",
  },
  optionsEnglish: [
    {
      type: String,
      trim: true,
    },
  ],
  optionsHindi: [
    {
      type: String,
      trim: true,
    },
  ],
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  mockTest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockTest",
    },
  ],
  preparationTest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreparationTest",
    },
  ],
  questionImageEnglish: {
    type: String,
    default: "",
  },
  solutionImageEnglish: {
    type: String,
    default: "",
  },
  optionImageEnglish: [
    {
      type: String,
      default: "",
    },
  ],
  questionImageHindi: {
    type: String,
    default: "",
  },
  solutionImageHindi: {
    type: String,
    default: "",
  },
  optionImageHindi: [
    {
      type: String,
      default: "",
    },
  ],
  solutionDetailHind: {
    type: String,
    trim: true,
    default: "",
  },
  solutionDetailEnglish: {
    type: String,
    trim: true,
    default: "",
  },
  difficulty: {
    type: String,
    trim: true,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
  },
  queGivenTime: {
    type: Number,
    default: 120,
  },
  showQueTime: {
    type: Boolean,
    default: true,
  },
  isMcq: {
    type: Boolean,
    default: false,
  },
  showAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
