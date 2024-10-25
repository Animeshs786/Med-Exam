const mongoose = require("mongoose");

const eBookSchema = new mongoose.Schema({
  title: String,
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
  coverImage: String,
  link: String,
  file: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const eBook = mongoose.model("eBook", eBookSchema);

module.exports = eBook;
