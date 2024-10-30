const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subHeading: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    detail: [
      {
        type: String,
        default: "",
      },
    ],
    ratingNumber: {
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
    bannerImage: {
      type: String,
      required: true,
    },
    thumbImage: {
      type: String,
      required: true,
    },
    previewImage: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
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

const Note = mongoose.model("Note", notesSchema);
module.exports = Note;
