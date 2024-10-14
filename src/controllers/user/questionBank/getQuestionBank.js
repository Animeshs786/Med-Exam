const QuestionBank = require("../../../models/questionBank");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getQuestionBank = catchAsync(async (req, res, next) => {
  const mockTestId = req.params.id;

  const questionBank = await QuestionBank.findById(mockTestId);
  if (!questionBank) {
    return next(new AppError("Question bank not found", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      questionBank,
    },
  });
});
