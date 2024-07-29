const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");

exports.getTopNotes = catchAsync(async (req, res) => {
  const notes = await Note.find({ topNotes: true }).select("logo");

  res.status(200).json({
    status: true,
    message: "Notes fetched successfully",
    data: {
      notes,
    },
  });
});
