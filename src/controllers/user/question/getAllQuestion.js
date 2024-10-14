const AttemptTest = require("../../../models/attemtTest");
const Question = require("../../../models/question");
const TestTime = require("../../../models/testTime");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuestions = catchAsync(async (req, res) => {
  const {
    subject,
    search,
    mockTest,
    questionBank,
    preparationTest,
    customBank,
  } = req.query;
  const userId = req.user._id;

  const obj = {};
  if (subject) obj.subject = subject;
  if (search) obj.questionNameEnglish = { $regex: search, $options: "i" };
  if (mockTest) obj.mockTest = { $in: [mockTest] };
  if (customBank) obj.customBank = { $in: [customBank] };
  if (questionBank) obj.questionBank = { $in: [questionBank] };
  if (preparationTest) obj.preparationTest = { $in: [preparationTest] };

  let questions = await Question.find(obj).populate("subject", "name").exec();

  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
  questions = questions.sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );

  const timeData = await TestTime.findOne({
    user: userId,
    mockTest: mockTest || null,
    preparationTest: preparationTest || null,
    questionBank: questionBank || null,
  });

  const attemptDetails = await AttemptTest.find({
    userId: userId,
    mockTest: mockTest || null,
    preparationTest: preparationTest || null,
    questionBank: questionBank || null,
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
    inProgress: attemptDetails.length > 0 ? true : false,
  });
});
