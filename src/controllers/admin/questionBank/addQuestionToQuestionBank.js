const Question = require("../../../models/question");
const QuestionBank = require("../../../models/questionBank");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.addQuestionToQuestionBank = catchAsync(async (req, res, next) => {
  const { questions, questionBankId } = req.body;

  const questionBank = await QuestionBank.findById(questionBankId);
  if (!questionBank) {
    return next(new AppError("Preparation test not found.", 404));
  }

  for (const question of questions) {
    const newQuestion = await Question.findById(question);
    newQuestion.questionBank.push(questionBankId);
    await newQuestion.save();
  }

  res.status(201).json({
    status: true,
    message: "Add Question successfully.",
  });
});
