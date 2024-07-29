const ExamSubCategory = require("../../../models/examSubCategory");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateExamSubCategory = catchAsync(async (req, res, next) => {
  const { name, exam, status } = req.body;
  let thumbImage;

  if (req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const updateData = { name, exam, status };

  if (thumbImage) {
    updateData.thumbImage = thumbImage;
  }

  const updatedExamSubCategory = await ExamSubCategory.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedExamSubCategory) {
    return next(new AppError("No ExamSubCategory found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "ExamSubCategory updated successfully",
    data: {
      examSubCategory: updatedExamSubCategory,
    },
  });
});
