const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteNote = catchAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new Error("Note not found"));
  }

  if (note.thumbImage) {
    await deleteOldFiles(note.thumbImage).catch((err) =>
      console.error("Failed to delete thumb image", err)
    );
  }

  if (note.logo) {
    await deleteOldFiles(note.logo).catch((err) =>
      console.error("Failed to delete logo", err)
    );
  }

  if (note.notes.length > 0) {
    await Promise.all(
      note.notes.map((filePath) =>
        deleteOldFiles(filePath).catch((err) =>
          console.error("Failed to delete note file", err)
        )
      )
    );
  }

  await Note.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: true,
    message: "Notes delete successfully.",
  });
});
