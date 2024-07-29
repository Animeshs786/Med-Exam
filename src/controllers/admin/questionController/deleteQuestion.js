const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return next(new AppError("No question found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "Question delete successfully.",
    data: null,
  });
});
