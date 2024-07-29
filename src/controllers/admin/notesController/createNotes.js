const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");

exports.createNote = catchAsync(async (req, res) => {
  let thumbImage;
  let logo;
  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  if (req.files.logo) {
    logo = `${req.files.logo[0].destination}/${req.files.logo[0].filename}`;
  }

  const {
    name,
    description,
    price,
    isPremium,
    exam,
    topNotes,
    language,
    detail,
  } = req.body;

  const noteData = {
    name,
    description,
    price,
    isPremium,
    topNotes,
    thumbImage,
    logo,
  };

  if (exam) noteData.exam = JSON.parse(exam);
  if (language) noteData.language = JSON.parse(language);
  if (detail) noteData.detail = JSON.parse(detail);

  const newNote = await Note.create(noteData);

  res.status(201).json({
    status: true,
    message: "Note created successfully",
    data: {
      note: newNote,
    },
  });
});
