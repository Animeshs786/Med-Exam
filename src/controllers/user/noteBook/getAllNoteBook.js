const NoteBook = require("../../../models/notebook");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllNoteBook = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { classId } = req.query;
  const notebook = await NoteBook.find({ user: userId, class: classId }).select(
    "image"
  );

  if (!notebook) {
    return next(new AppError("No NoteBook found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    results: notebook.length,
    data: {
      notebook,
    },
  });
});
