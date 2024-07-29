const NoteSubject = require("../../../models/notesSubject");
const catchAsync = require("../../../utils/catchAsync");

// Get all NoteSubjects
exports.getAllNoteSubjects = catchAsync(async (req, res) => {
  const noteSubjects = await NoteSubject.find();

  res.status(200).json({
    status: true,
    results: noteSubjects.length,
    message: "Notes fetched successfully",
    data: {
      noteSubjects,
    },
  });
});
