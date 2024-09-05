const mongoose = require("mongoose");

const attemptTest = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  mockTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  timeTaken: {
    type: Number,
    default: 0,
  },
  givenAnswerIndex: {
    type: String,
    default: "",
  },
  isMarkedForReview: {
    type: Boolean,
    default: false,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  accessQuestion: {
    type: Boolean,
    default: true, //timeTaken greater or equal to queGivenTime then turn its value false
  },
  questionLanguage:{
    type:String,
    default:"English"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AttemptTest = mongoose.model("attemptTest", attemptTest);
module.exports = AttemptTest;
