const TestResult = require("../../../models/testResult");
const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.getTestAnalysis = catchAsync(async (req, res, next) => {
  const testResultId = req.params.id;

  // Find the test result by ID
  const testResult = await TestResult.findById(testResultId)
    .populate({
      path: "submittedAnswers.question",
      populate: { path: "subject" },
    })
    .populate("mockTest");

  if (!testResult) {
    return next(new AppError("Test result not found", 404));
  }

  // Get all questions for the mock test
  const questions = await Question.find({
    mockTest: testResult.mockTest._id,
  }).populate("subject");

  // Prepare the analysis
  const analysis = questions.map((question) => {
    const submittedAnswer = testResult.submittedAnswers.find((sa) =>
      sa.question._id.equals(question._id)
    );

    return {
      question: {
        id: question._id,
        text: question.question,
        correctAnswer: question.correctAnswer,
        options: question.options,
        hindiQuestion: question.hindiQuestion,
        hindiOptions: question.hindiOptions,
        subject: question.subject,
      },
      userAnswer: submittedAnswer ? submittedAnswer.answer : null,
      bookmarked: submittedAnswer ? submittedAnswer.bookmarked : false,
      isCorrect: submittedAnswer ? submittedAnswer.isCorrect : false,
    };
  });

  // Sort analysis by subject
  analysis.sort((a, b) => {
    if (a.question.subject.name < b.question.subject.name) return -1;
    if (a.question.subject.name > b.question.subject.name) return 1;
    return 0;
  });

  res.status(200).json({
    status: true,
    message: "Test analysis fetched successfully",
    data: {
      testResult: {
        user: testResult.user,
        mockTest: testResult.mockTest,
        totalCorrect: testResult.totalCorrect,
        totalIncorrect: testResult.totalIncorrect,
        totalUnattempted: testResult.totalUnattempted,
        skip: testResult.skip,
        totalAttempted: testResult.totalAttempted,
        totalMarks: testResult.totalMarks,
        accuracy: testResult.accuracy,
        timeTaken: testResult.timeTaken,
        speed: testResult.speed,
        createdAt: testResult.createdAt,
      },
      analysis,
    },
  });
});


