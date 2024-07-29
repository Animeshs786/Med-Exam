const NoteSubject = require("../../../models/notesSubject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

// Delete NoteSubject
exports.deleteNoteSubject = catchAsync(async (req, res, next) => {
  const noteSubject = await NoteSubject.findById(req.params.id);

  if (!noteSubject) {
    return next(new AppError("NoteSubject not found", 404));
  }

  if (noteSubject.thumbImage) {
    await deleteOldFiles(noteSubject.thumbImage).catch((err) =>
      console.error("Failed to delete thumb image", err)
    );
  }

  if (noteSubject.files.length > 0) {
    await Promise.all(
      noteSubject.files.map((filePath) =>
        deleteOldFiles(filePath).catch((err) =>
          console.error("Failed to delete note file", err)
        )
      )
    );
  }

  await NoteSubject.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: true,
    message: "NoteSubject deleted successfully",
  });
});
