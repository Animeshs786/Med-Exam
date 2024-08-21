const { isValidObjectId } = require("mongoose");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const NoteSubject = require("../../../models/notesSubject");

exports.getNoteChapterDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(id)) {
    return next(new AppError("Invalid note chapter id", 400));
  }

  const subjects = await NoteSubject.findById(id);

  if (!subjects) {
    return next(new AppError("Note chapter not found", 404));
  }

  if (!subjects.watchBy.includes(userId)) {
    subjects.watchBy.push(userId);
    await subjects.save(); // Save the updated document to the database
  }

  res.status(200).json({
    status: true,
    message: "Chapter retrieved successfully.",
    data: {
      detail: subjects,
    },
  });
});
