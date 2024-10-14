const Question = require("../../../models/question");
const SubmittedAnswer = require("../../../models/submittedAnswer");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.getSolution = catchAsync(async (req, res, next) => {
  const { questionId, type = "Submit" } = req.body;
  const userId = req.user.id;

  // Get the question by ID
  const question = await Question.findById(questionId);
  if (!question) {
    return next(new AppError("Question not found.", 404));
  }
  let userSubmission;
  // Get the user's submitted answer
  if (type === "Preparation") {
    userSubmission = await SubmittedAnswer.findOne({
      question: questionId,
      user: userId,
      type: "Submit",
      isPreparation: true,
    }).sort("-_id");
  } else {
    userSubmission = await SubmittedAnswer.findOne({
      question: questionId,
      user: userId,
      type,
    }).sort("-_id");
  }

  if (!userSubmission) {
    return next(new AppError("No answer found for this user.", 404));
  }

  // Determine if the user's submitted answer is correct
  const isCorrect =
    (userSubmission.language === "English" &&
      userSubmission.answer === question.correctAnswerEnglish) ||
    (userSubmission.language === "Hindi" &&
      userSubmission.answer === question.correctAnswerHindi);

  // Fetch all submissions for the question to calculate percentages
  const totalSubmissions = await SubmittedAnswer.countDocuments({
    question: questionId,
    type: type === "Preparation" ? "Submit" : type,
  });

  // Select options based on the language of the user's submission
  const options =
    userSubmission.language === "English"
      ? question.optionsEnglish
      : question.optionsHindi;

  // Calculate the percentage of submissions for each option
  const optionPercentage = await Promise.all(
    options.map(async (option, index) => {
      const count = await SubmittedAnswer.countDocuments({
        question: questionId,
        answer: index.toString(),
        language: userSubmission.language,
      });
      return {
        option: option,
        percentage: ((count / totalSubmissions) * 100).toFixed(2),
      };
    })
  );

  res.status(200).json({
    status: true,
    message: "Solution fetched successfully.",
    data: {
      question:
        userSubmission.language === "English"
          ? question.questionNameEnglish
          : question.questionNameHindi,
      userAnswer: userSubmission.answer,
      isCorrect,
      optionPercentage,
      questionDetails: {
        questionNameEnglish: question?.questionNameEnglish,
        questionNameHindi: question?.questionNameHindi,
        solutionImageEnglish: question?.solutionImageEnglish,
        solutionImageHindi: question?.solutionImageHindi,
        correctAnswerEnglish: question?.correctAnswerEnglish,
        correctAnswerHindi: question?.correctAnswerHindi,
        solutionDetailEnglish: question?.solutionDetailEnglish,
        solutionDetailHind: question?.solutionDetailHind,
        questionImageEnglish: question?.questionImageEnglish,
        questionImageHindi: question?.questionImageHindi,
      },
    },
  });
});
