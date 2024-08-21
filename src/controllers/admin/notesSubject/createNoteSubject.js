const NoteSubject = require("../../../models/notesSubject");
const catchAsync = require("../../../utils/catchAsync");

// Create NoteSubject
exports.createNoteSubject = catchAsync(async (req, res) => {
  let files = [];

  if (req.files.files) {
    files = req.files.files.map(
      (file) => `${file.destination}/${file.filename}`
    );
  }

  const { name,  note,subject,subHeading } = req.body;

  const newNoteSubject = await NoteSubject.create({
    name,

    files,
    note,
    subject,
    subHeading,
  });

  res.status(201).json({
    status: true,
    message: "Note chapter created successfully",
    data: {
      noteSubject: newNoteSubject,
    },
  });
});
