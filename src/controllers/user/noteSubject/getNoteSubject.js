const { isValidObjectId } = require("mongoose");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const NoteSubject = require("../../../models/notesSubject");

exports.getNoteSubject = catchAsync(async (req, res, next) => {
  const { search, note } = req.query;
  const filterObj = {};

  if (!isValidObjectId(note)) return next(new AppError("Invalid note id", 400));
  if (search) {
    filterObj.name = { $regex: search, $options: "i" };
  }
  if (note) filterObj.note = note;
  const subjects = await NoteSubject.find(filterObj);

  res.status(200).json({
    status: true,
    message: "Subject retrived successfully.",
    data: {
      subjects,
    },
  });
});
