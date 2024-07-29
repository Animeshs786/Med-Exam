const TestSeries = require("../../../models/testSeries");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getTestSeries = catchAsync(async (req, res, next) => {
  const testSeries = await TestSeries.findById(req.params.id);

  if (!testSeries) {
    return next(new AppError("No testSeries found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "TestSeries fetched successfully",
    data: {
      testSeries,
    },
  });
});
