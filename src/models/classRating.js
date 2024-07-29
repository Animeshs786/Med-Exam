const mongoose = require("mongoose");

const classRatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User must be required."],
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: [true, "Class must be required."],
  },
  rating: {
    type: Number,
    // required: [true, "Rating must be required."],
    min: [1, "Rating must be greater than 1"],
    max: [5, "Rating must be less than 5"],
  },
  report: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClassRating = mongoose.model("ClassRating", classRatingSchema);
module.exports = ClassRating;
