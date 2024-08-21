const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getMockTest = catchAsync(async (req, res, next) => {
  const mockTestId = req.params.id;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    return next(new AppError("Mock Test not found", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      mockTest,
    },
  });
});
