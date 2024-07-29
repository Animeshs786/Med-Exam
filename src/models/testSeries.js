const mongoose = require("mongoose");

const testSeriesSchema = new mongoose.Schema(
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

testSeriesSchema.virtual("mockTest", {
  ref: "MockTest", // Correct reference
  foreignField: "testSeries",
  localField: "_id",
});

const TestSeries = mongoose.model("TestSeries", testSeriesSchema);
module.exports = TestSeries;
