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
  mockTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
    required: true,
  },
  questionImageEnglish: {
    type: String,
    default: "",
  },
  solutionImageEnglish: {
    type: String,
    default: "",
  },
  optionImage1English: {
    type: String,
    default: "",
  },
  optionImage2English: {
    type: String,
    default: "",
  },
  optionImage3English: {
    type: String,
    default: "",
  },
  optionImage4English: {
    type: String,
    default: "",
  },
  questionImageHindi: {
    type: String,
    default: "",
  },
  solutionImageHindi: {
    type: String,
    default: "",
  },
  optionImage1Hindi: {
    type: String,
    default: "",
  },
  optionImage2Hindi: {
    type: String,
    default: "",
  },
  optionImage3Hindi: {
    type: String,
    default: "",
  },
  optionImage4Hindi: {
    type: String,
    default: "",
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
