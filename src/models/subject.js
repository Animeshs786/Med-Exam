const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbImage:{
    type: String,
    default: "",
  },
  slug: {
    type: String,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
