const PreviousPaper = require("../../../models/previousPaper");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deletePreviousPaper = catchAsync(async (req, res, next) => {
  const previousPaper = await PreviousPaper.findByIdAndDelete(req.params.id);

  if (!previousPaper) {
    return next(new AppError("No previousPaper found with that ID", 404));
  }

  if (previousPaper.thumbImage) {
    await deleteOldFiles(previousPaper.thumbImage);
  }

  res.status(200).json({
    status: true,
    message: "PreviousPaper deleted successfully",
    data: null,
  });
});
