const NoteSubject = require("../../../models/notesSubject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

// Update NoteSubject
exports.updateNoteSubject = catchAsync(async (req, res, next) => {
  const noteSubject = await NoteSubject.findById(req.params.id);

  if (!noteSubject) {
    return next(new AppError("NoteSubject not found", 404));
  }

  let files = [];

  if (req.files.files) {
    files = req.files.files.map(
      (file) => `${file.destination}/${file.filename}`
    );
    if (noteSubject.files.length > 0) {
      await Promise.all(
        noteSubject.files.map((filePath) =>
          deleteOldFiles(filePath).catch((err) =>
            console.error("Failed to delete note file", err)
          )
        )
      );
    }
  }

  const { name, note, subject, subHeading } = req.body;
  const updatedData = {};

  if (name) updatedData.name = name;
  if (note) updatedData.note = note;
  if (subject) updatedData.subject = subject;
  if (subHeading) updatedData.subHeading = subHeading;
  if (files.length > 0) updatedData.files = files;

  const updatedNoteSubject = await NoteSubject.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: true,
    message: "Note chapter updated successfully",
    data: {
      noteSubject: updatedNoteSubject,
    },
  });
});
