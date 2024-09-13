const AttemptTest = require("../../../models/attemtTest");
const Question = require("../../../models/question");
const TestTime = require("../../../models/testTime");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const { subject, search, mockTest } = req.query;
  console.log(req.user._id, "testing");
  const userId = req.user._id;

  if (!mockTest) return next(new AppError("Please provide a mock test", 400));

  const obj = {};
  if (subject) obj.subject = subject;
  if (search) obj.questionNameEnglish = { $regex: search, $options: "i" };
  if (mockTest) obj.mockTest = { $in: [mockTest] };

  let questions = await Question.find(obj).populate("subject", "name").exec();

  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
  questions = questions.sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );

  const timeData = await TestTime.findOne({
    user: userId,
    mockTest: mockTest,
  });

  const attemptDetails = await AttemptTest.find({
    userId: userId,
    mockTest: mockTest,
  }).exec();

  const allQuestion = questions.map((question) => {
    const attempt = attemptDetails.find(
      (attempt) => attempt.question.toString() === question?._id.toString()
    );

    return {
      _id: question._id,
      questionNameEnglish: question.questionNameEnglish,
      questionNameHindi: question.questionNameHindi,
      correctAnswerEnglish: question.correctAnswerEnglish,
      correctAnswerHindi: question.correctAnswerHindi,
      optionsEnglish: question.optionsEnglish,
      optionsHindi: question.optionsHindi,
      subject: question.subject
        ? {
            _id: question.subject._id,
            name: question.subject.name,
          }
        : null, // Handle cases where subject is missing
      queGivenTime: question.queGivenTime,
      showQueTime: question.showQueTime,
      questionImageEnglish: question.questionImageEnglish || "",
      solutionImageEnglish: question.solutionImageEnglish || "",
      optionImageEnglish: question.optionImageEnglish || ["", "", "", ""],
      questionImageHindi: question.questionImageHindi || "",
      solutionImageHindi: question.solutionImageHindi || "",
      optionImageHindi: question.optionImageHindi || ["", "", "", ""],
      solutionDetailHindi: question.solutionDetailHindi || "",
      solutionDetailEnglish: question.solutionDetailEnglish || "",
      difficulty: question.difficulty,
      createdAt: question.createdAt,
      timeTaken: attempt?.timeTaken ?? 0,
      givenAnswerIndex: attempt?.givenAnswerIndex ?? "",
      isMarkedForReview: attempt?.isMarkedForReview ?? false,
      isSubmitted: attempt?.isSubmitted ?? false,
      accessQuestion: attempt?.accessQuestion ?? true,
      __v: question.__v,
    };
  });

  res.status(200).json({
    status: true,
    results: allQuestion.length,
    data: allQuestion,
    timeLeft: timeData?.testTime ? timeData?.testTime : 120,
    isReattempt: timeData?.testTime ? true : false,
  });
});
