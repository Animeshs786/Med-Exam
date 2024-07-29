const Exam = require("../../../models/exam");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteExam = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const exam = await Exam.findByIdAndDelete(id);

  if (!exam) {
    return next(new AppError("No exam found with that ID", 404));
  }

  // Delete the image file
  if (exam.thumbImage) {
    await deleteOldFiles(exam.thumbImage).catch((err) => {
      console.error("Failed to delete image:", err);
    });
  }

  res.status(200).json({
    status: true,
    message: "Exam deleted successfully",
    data: null,
  });
});
