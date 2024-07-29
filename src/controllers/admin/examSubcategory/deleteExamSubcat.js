const ExamSubCategory = require("../../../models/examSubCategory");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteExamSubCategory = catchAsync(async (req, res, next) => {
  const examSubCategory = await ExamSubCategory.findByIdAndDelete(
    req.params.id
  );

  if (!examSubCategory) {
    return next(new AppError("No ExamSubCategory found with that ID", 404));
  }

  if (examSubCategory.thumbImage) {
    await deleteOldFiles(examSubCategory.thumbImage);
  }

  res.status(200).json({
    status: true,
    message: "ExamSubCategory deleted successfully",
    data: null,
  });
});
