const NoteSubject = require("../../../models/notesSubject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Get NoteSubject by ID
exports.getNoteSubject = catchAsync(async (req, res, next) => {
  const noteSubject = await NoteSubject.findById(req.params.id);

  if (!noteSubject) {
    return next(new AppError("NoteSubject not found", 404));
  }

  res.status(200).json({
    status: true,
    message: "note fetched successfullly.",
    data: {
      noteSubject,
    },
  });
});
