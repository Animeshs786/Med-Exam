const mongoose = require("mongoose");

const submittedSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  answer: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    enum: ["English", "Hindi"],
    default: "English",
  },
  type: {
    type: String,
    enum: ["Submit", "Mark", "MCQ"],
    required: true,
  },
  isPreparation: {
    type: Boolean,
    default: false,
  },
  isTemp:{
    type:Boolean,
    default:false,
  },
  bookmarked: {
    type: Boolean,
    default: false,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SubmittedAnswer = mongoose.model("SubmittedAnswer", submittedSchema);
module.exports = SubmittedAnswer;
