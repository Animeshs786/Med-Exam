const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getMockTest = catchAsync(async (req, res, next) => {
  const mockTestId = req.params.id;

  if (!mockTestId) {
    return next(new AppError("Please provide a mock test id in params", 400));
  }
  const mockTest = await MockTest.findById(mockTestId);

  res.status(200).json({
    status: true,
    data: {
      mockTest,
    },
  });
});
