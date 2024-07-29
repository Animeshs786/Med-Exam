const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return next(new AppError("No question found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "Question update successfully.",
    data: {
      question,
    },
  });
});
