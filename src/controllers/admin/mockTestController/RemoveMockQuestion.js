const Question = require("../../../models/question");
const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.removeQuestionFromMockTest = catchAsync(async (req, res, next) => {
  const { questionId, mockTestId } = req.body;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    return next(new AppError("Mock test not found.", 404));
  }

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new AppError("Question not found.", 404));
  }

  question.mockTest = question.mockTest.filter(
    (id) => id.toString() !== mockTestId
  );

  await question.save();
  res.status(200).json({
    status: true,
    message: "Mock test ID removed from question.",
    data: question,
  });
});
