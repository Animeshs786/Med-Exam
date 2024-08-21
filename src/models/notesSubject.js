const mongoose = require("mongoose");

const notesSubjetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subHeading: {
    type: String,
    default: "",
  },
  thumbImage: String,
  files: [String],
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    requried: true,
  },
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    requried: true,
  },
  watchBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NoteSubject = mongoose.model("NoteSubject", notesSubjetSchema);
module.exports = NoteSubject;
