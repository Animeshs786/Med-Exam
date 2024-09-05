// const Question = require("../../../models/question");
// const AppError = require("../../../utils/AppError");
// const catchAsync = require("../../../utils/catchAsync");

// exports.getAllQuestions = catchAsync(async (req, res, next) => {
//   const { subject, search, mockTest } = req.query;
//   if (!mockTest) return next(new AppError("Please provide a mock test", 400));
//   const userId = req.user._id;
//   const obj = {};
//   if (subject) obj.subject = subject;
//   if (search) obj.question = { $regex: search, $options: "i" };
//   if (mockTest) obj.mockTest = mockTest;
//   let allQuestion = [];

//   // Fetch questions
//   let questions = await Question.find(obj).populate("subject", "name").exec();

//   // Sort questions by difficulty manually
//   const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
//   questions = questions.sort(
//     (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
//   );

//   // Group questions by subject
//   const groupedQuestions = questions.reduce((acc, question) => {
//     const subjectName = question.subject.name;

//     if (!acc[subjectName]) {
//       acc[subjectName] = [];
//     }

//     // acc[subjectName].push(question);
//     allQuestion.push(question);

//     return acc;
//   }, {});

//   res.status(200).json({
//     status: true,
//     results: allQuestion.length,
//     data: allQuestion,
//   });
// });

const AttemptTest = require("../../../models/attemtTest");
const Question = require("../../../models/question");
const TestTime = require("../../../models/testTime");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const { subject, search, mockTest } = req.query;
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
  const timeData = await TestTime.find({
    user: userId,
    mockTest: mockTest,
  });

  const attemptDetails = await AttemptTest.find({
    userId: userId,
    mockTest: mockTest,
  }).exec();

  const allQuestion = questions.map((question) => {
    const attempt = attemptDetails.find(
      (attempt) => attempt.question.toString() === question._id.toString()
    );

    return {
      _id: question._id,
      questionNameEnglish: question.questionNameEnglish,
      questionNameHindi: question.questionNameHindi,
      correctAnswerEnglish: question.correctAnswerEnglish,
      correctAnswerHindi: question.correctAnswerHindi,
      optionsEnglish: question.optionsEnglish,
      optionsHindi: question.optionsHindi,
      subject: {
        _id: question.subject._id,
        name: question.subject.name,
      },
      // mockTest: question.mockTest,
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
      timeTaken: attempt ? attempt.timeTaken : 0,
      givenAnswerIndex: attempt ? attempt.givenAnswerIndex : "",
      isMarkedForReview: attempt ? attempt.isMarkedForReview : false,
      isSubmitted: attempt ? attempt.isSubmitted : false,
      accessQuestion: attempt ? attempt.accessQuestion : true,
      __v: question.__v,
    };
  });
  res.status(200).json({
    status: true,
    results: allQuestion.length,
    data: allQuestion,
    timeLeft: timeData?.TestTime ? timeData?.TestTime : "",
  });
});
