const TestSeries = require("../../../models/testSeries");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateTestSeries = catchAsync(async (req, res, next) => {
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

  const testSeries = await TestSeries.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!testSeries) {
    return next(new AppError("No testSeries found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "TestSeries updated successfully",
    data: {
      testSeries: testSeries,
    },
  });
});
