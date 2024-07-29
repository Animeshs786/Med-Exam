const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  status:{
    type:Boolean,
    default:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;
