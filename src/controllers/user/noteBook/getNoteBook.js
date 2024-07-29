const NoteBook = require("../../../models/notebook");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getNoteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const notebook = await NoteBook.findById(id).populate("user class");

  if (!notebook) {
    return next(new AppError("No NoteBook found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      notebook,
    },
  });
});
