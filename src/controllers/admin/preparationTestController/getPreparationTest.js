const PreparationTest = require("../../../models/preparationTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getPreparationTest = catchAsync(async (req, res, next) => {
  const preparationTestId = req.params.id;

  if (!preparationTestId) {
    return next(
      new AppError("Please provide a preparation test id in params", 400)
    );
  }
  const preparationTest = await PreparationTest.findById(preparationTestId);

  res.status(200).json({
    status: true,
    data: {
      preparationTest,
    },
  });
});
