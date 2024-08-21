const mongoose = require("mongoose");

const testSeriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subHeading: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    thumbImage: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    details: [String],
    price: {
      type: Number,
      default: 0,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    isSubjectTest: {
      type: Boolean,
      default: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    isFullTest: {
      type: Boolean,
      default: true,
    },
    isChapterTest: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingNumber: {
      type: Number,
      default: 0,
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

// testSeriesSchema.virtual("mockTest", {
//   ref: "MockTest", // Correct reference
//   foreignField: "testSeries",
//   localField: "_id",
// });

const TestSeries = mongoose.model("TestSeries", testSeriesSchema);
module.exports = TestSeries;
