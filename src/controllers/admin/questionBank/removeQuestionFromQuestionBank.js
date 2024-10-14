const Question = require("../../../models/question");
const QuestionBank = require("../../../models/questionBank");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.removeQuestionFromQuestionBank = catchAsync(async (req, res, next) => {
  const { questionId, questionBankId } = req.body;

  const questionBank = await QuestionBank.findById(questionBankId);
  if (!questionBank) {
    return next(new AppError("Question Bank not found.", 404));
  }

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new AppError("Question not found.", 404));
  }

  question.questionBank = question.questionBank.filter(
    (id) => id.toString() !== questionBankId
  );

  await question.save();
  res.status(200).json({
    status: true,
    message: "Question Removed Successfully.",
  });
});
