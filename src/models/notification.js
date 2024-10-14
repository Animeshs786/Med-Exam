const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    thumbImage: {
      type: String,
      default: "",
    },
    redirectType: {
      type: String,
      default: "Internal",
      enum: ["Internal", "External"],
    },
    type: {
      type: String,
      enum: ["testSeries", "note", "course", "class", "announcement"],
      required: true,
    },
    webUrl: String,
    url: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
