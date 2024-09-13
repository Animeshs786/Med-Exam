const Question = require("../../../models/question");
const SubmittedAnswer = require("../../../models/submittedAnswer");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.submitMcq = catchAsync(async (req, res, next) => {
  const { questionId, answer, language } = req.body;
  const userId = req.user._id;

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new AppError("Question not found.", 404));
  }

  const isCorrect =
    (language === "English" && question.correctAnswerEnglish === answer) ||
    (language === "Hindi" && question.correctAnswerHindi === answer);


  const submittedAnswer = await SubmittedAnswer.create({
    question: questionId,
    user: userId,
    answer,
    language,
    type: "MCQ",
    isCorrect,
  });

  res.status(201).json({
    status: true,
    message: "MCQ submitted successfully.",
    data: submittedAnswer,
  });
});
