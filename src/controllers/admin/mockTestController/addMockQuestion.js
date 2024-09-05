const Question = require("../../../models/question");
const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.addQuestionToMockTest = catchAsync(async (req, res, next) => {
  const { questions, mockTestId } = req.body;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    return next(new AppError("Mock test not found.", 404));
  }

  for (const question of questions) {
    const newQuestion = await Question.findById(question);
    newQuestion.mockTest.push(mockTestId);
    await newQuestion.save();
  }

  res.status(201).json({
    status: true,
    message: "Add Question successfully.",
  });
});
