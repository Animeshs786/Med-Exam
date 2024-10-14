const PreparationTest = require("../../../models/preparationTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getPreparationTest = catchAsync(async (req, res, next) => {
  const mockTestId = req.params.id;

  const preparationTest = await PreparationTest.findById(mockTestId);
  if (!preparationTest) {
    return next(new AppError("Preparation Test not found", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      preparationTest,
    },
  });
});
