const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError("No question found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      question,
    },
  });
});
