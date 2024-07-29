const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  thumbImage: String,
  status: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ExamSubCategory = mongoose.model("ExamSubCategory", examSchema);
module.exports = ExamSubCategory;