const mongoose = require("mongoose");

const examCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "Name already exist."],
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

const ExamCategory = mongoose.model("ExamCategory", examCategorySchema);

module.exports = ExamCategory;
