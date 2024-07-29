const NoteSubject = require("../../../models/notesSubject");
const catchAsync = require("../../../utils/catchAsync");

// Create NoteSubject
exports.createNoteSubject = catchAsync(async (req, res) => {
  let thumbImage;
  let files = [];

  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  if (req.files.files) {
    files = req.files.files.map(
      (file) => `${file.destination}/${file.filename}`
    );
  }

  const { name, duration, note } = req.body;

  const newNoteSubject = await NoteSubject.create({
    name,
    thumbImage,
    duration,
    files,
    note,
  });

  res.status(201).json({
    status: true,
    message: "NoteSubject created successfully",
    data: {
      noteSubject: newNoteSubject,
    },
  });
});
