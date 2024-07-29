const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  hindiQuestion: String,
  correctAnswer: Number,
  options: [String],
  hindiOptions: [String],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
