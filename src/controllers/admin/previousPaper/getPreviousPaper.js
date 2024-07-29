const PreviousPaper = require("../../../models/previousPaper");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getPreviousPaper = catchAsync(async (req, res, next) => {
  const previousPaper = await PreviousPaper.findById(req.params.id);

  if (!previousPaper) {
    return next(new AppError("No previousPaper found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "PreviousPaper fetched successfully",
    data: {
      previousPaper,
    },
  });
});
