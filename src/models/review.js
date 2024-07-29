const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User must be required."],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course must be required."],
  },
  rating: {
    type: Number,
    required: [true, "Rating must be required."],
    min: [1, "Rating must be greater than 1"],
    max: [5, "Rating must be less than 5"],
  },
  review: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
