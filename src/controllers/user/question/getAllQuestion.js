const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const { subject, search, mockTest } = req.query;
  if (!mockTest) return next(new AppError("Please provide a mock test", 400));

  const obj = {};
  if (subject) obj.subject = subject;
  if (search) obj.question = { $regex: search, $options: "i" };
  if (mockTest) obj.mockTest = mockTest;

  // Fetch questions
  let questions = await Question.find(obj).populate("subject", "name").exec();

  // Sort questions by difficulty manually
  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
  questions = questions.sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );

  // Group questions by subject
  const groupedQuestions = questions.reduce((acc, question) => {
    const subjectName = question.subject.name;

    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }

    acc[subjectName].push(question);

    return acc;
  }, {});

  res.status(200).json({
    status: true,
    results: Object.keys(groupedQuestions).length,
    data: groupedQuestions,
  });
});

