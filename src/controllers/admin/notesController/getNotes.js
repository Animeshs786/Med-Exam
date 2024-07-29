const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");

exports.getNotes = catchAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new Error("Note not found"));
  }

  res.status(200).json({
    status: true,
    message: "Note fetched successfully",
    data: {
      note,
    },
  });
});
