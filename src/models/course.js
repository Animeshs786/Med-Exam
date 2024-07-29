const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subHeading: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    isPremium: {
      type: Boolean,
      default: true,
    },
    exam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    ratingNumber: {
      type: Number,
      default: 0,
    },
    purchasedNumber: {
      type: Number,
      default: 0,
    },
    pdf: [{ type: String, default: "" }],
    previewBanner: [{ type: String, default: "" }],
    topDescription: {
      type: String,
      default: "",
    },
    bottomDescription: {
      type: String,
      default: "",
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    isRecorded: {
      type: Boolean,
      default: true,
    },
    isPdf: {
      type: Boolean,
      default: true,
    },
    isTestSeries: {
      type: Boolean,
      default: false,
    },
    thumbImage: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
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

// courseSchema.virtual("classes", {
//   ref: "Class",
//   localField: "_id",
//   foreignField: "course",
// });

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
