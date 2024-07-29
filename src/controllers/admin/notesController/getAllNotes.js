const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllNotes = catchAsync(async (req, res) => {
  const notes = await Note.find();

  res.status(200).json({
    status: true,
    message: "Notes fetched successfully",
    results: notes.length,
    data: {
      notes,
    },
  });
});
