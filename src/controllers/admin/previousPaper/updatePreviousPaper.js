const PreviousPaper = require("../../../models/previousPaper");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updatePreviousPaper = catchAsync(async (req, res, next) => {
  const { name, exam, price } = req.body;
  let thumbImage;

  if (req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const updateData = {};

  if (name) {
    updateData.name = name;
  }
  if (exam) {
    updateData.exam = exam;
  }
  if (price) {
    updateData.price = price;
  }

  if (thumbImage) {
    updateData.thumbImage = thumbImage;
  }

  const previousPaper = await PreviousPaper.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!previousPaper) {
    return next(new AppError("No previousPaper found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "PreviousPaper updated successfully",
    data: {
      previousPaper: previousPaper,
    },
  });
});
