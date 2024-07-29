const Question = require("../../../models/question");
const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.addQuestionToMockTest = catchAsync(async (req, res, next) => {
  const {
    question,
    hindiQuestion,
    correctAnswer,
    options,
    hindiOptions,
    subject,
    mockTestId,
  } = req.body;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    return next(new AppError("Mock test not found.", 404));
  }

  let existingQuestion = await Question.findOne({
    question,
    hindiQuestion,
  });

  if (existingQuestion) {
    if (!existingQuestion.mockTest.includes(mockTestId)) {
      existingQuestion.mockTest.push(mockTestId);
      await existingQuestion.save();
    }
  } else {
    existingQuestion = await Question.create({
      question,
      hindiQuestion,
      correctAnswer,
      options,
      hindiOptions,
      subject,
      mockTest: [mockTestId],
    });
  }

  res.status(201).json({
    status: true,
    message: "Add Question successfully.",
    data: existingQuestion,
  });
});
