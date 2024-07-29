const mongoose = require("mongoose");

const previousPaperSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    thumbImage: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

previousPaperSchema.virtual("mockTest", {
  ref: "MockTest", // Correct reference
  foreignField: "previousPaper",
  localField: "_id",
});
const PreviousPaper = mongoose.model("PreviousPaper", previousPaperSchema);
module.exports = PreviousPaper;
