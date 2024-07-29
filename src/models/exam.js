const mongoose = require("mongoose");

const mongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    thumbImage: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
mongooseSchema.index({ slug: 1 });

const Exam = mongoose.model("Exam", mongooseSchema);
module.exports = Exam;
