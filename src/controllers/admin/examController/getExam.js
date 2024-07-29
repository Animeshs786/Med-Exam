const Exam = require("../../../models/exam");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getExam = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);

  if (!exam) {
    return next(new AppError("No exam found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      exam,
    },
  });
});
