const mongoose = require("mongoose");

const mongooseSchema = new mongoose.Schema({
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
  image:String,
  createdAt:{
    type:Date,
    default:Date.now
  }
});

const NoteBook = mongoose.model("NoteBook", mongooseSchema);

module.exports = NoteBook;
