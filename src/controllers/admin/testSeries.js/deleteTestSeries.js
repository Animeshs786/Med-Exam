const TestSeries = require("../../../models/testSeries");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteTestSeries = catchAsync(async (req, res, next) => {
  const testSeries = await TestSeries.findByIdAndDelete(req.params.id);

  if (!testSeries) {
    return next(new AppError("No testSeries found with that ID", 404));
  }

  if (testSeries.thumbImage) {
    await deleteOldFiles(testSeries.thumbImage);
  }

  res.status(200).json({
    status: true,
    message: "TestSeries deleted successfully",
    data: null,
  });
});
