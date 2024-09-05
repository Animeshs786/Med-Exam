const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Live", "Recorded"],
    default:"Recorded",
  },
  url: String,
  schedule: {
    type: Date,
    default: "",
  },
  classEnd: {
    type: Date,
    default: "",
  },
  pdf: String,
  rating: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  mentor: {
    type: String,
    required: true,
  },
  thumbImage: {
    type: String,
    default: "",
  },
  watchBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  thumbnailUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
