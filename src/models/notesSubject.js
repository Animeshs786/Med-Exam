const mongoose = require("mongoose");

const notesSubjetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbImage: String,
  duration: {
    type: Number,
    default: 0,
  },
  files: [String],
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    requried: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NoteSubject = mongoose.model("NoteSubject", notesSubjetSchema);
module.exports = NoteSubject;
