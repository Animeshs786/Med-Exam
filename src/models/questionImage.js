const mongoose = require("mongoose");

const questionImageSchema = new mongoose.Schema({
  questionImageEnglish: String,
  questionImageHindi: String,
  solutionImageEnglish: String,
  solutionImageHindi: String,
  optionImageEnglish: [String],
  optionImageHindi: [String],
  name:String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuestionImage = mongoose.model("QuestionImage", questionImageSchema);
module.exports = QuestionImage;
