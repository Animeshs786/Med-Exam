const Note = require("../../../models/notes");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createNote = catchAsync(async (req, res,next) => {
  let thumbImage;
  let bannerImage;
  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  if (req.files.bannerImage) {
    bannerImage = `${req.files.bannerImage[0].destination}/${req.files.bannerImage[0].filename}`;
  }

  const { name, exam, subHeading, detail, description,course } = req.body;

  if(!course) return next(new AppError("Course id is required",400))

  const noteData = {
    name,
    subHeading,
    thumbImage,
    description,
    bannerImage,
    course
  };

  if (exam) noteData.exam = JSON.parse(exam);
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
