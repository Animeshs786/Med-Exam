const ExamSubCategory = require("../../../models/examSubCategory");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getExamSubCategory = catchAsync(async (req, res, next) => {
  const examSubCategory = await ExamSubCategory.findById(
    req.params.id
  );

  if (!examSubCategory) {
    return next(new AppError("No ExamSubCategory found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      examSubCategory,
    },
  });
});
