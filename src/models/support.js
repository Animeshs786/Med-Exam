const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  query: {
    type: String,
    trim: true,
    required: true,
  },
  solution: {
    type: String,
    trim: true,
    default: "",
  },
  cretaedAt: {
    type: Date,
    default: Date.now,
  },
});

const Support = new mongoose.model("Support", supportSchema);
module.exports = Support;
