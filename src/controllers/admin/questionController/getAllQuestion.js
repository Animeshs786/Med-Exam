const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllQuestions = catchAsync(async (req, res) => {
  const {
    subject,
    search,
    mockTest,
    page: currentPage,
    limit: currentLimit,
  } = req.query;
  const obj = {};
  if (subject) obj.subject = subject;
  if (search) obj.question = { $regex: search, $options: "i" };
  if (mockTest) obj.mockTest = { $in: [mockTest] };

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    Question,
    null,
    obj
  );

  const questions = await Question.find(obj)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    results: questions.length,
    totalResult,
    totalPage,
    data: {
      questions,
    },
  });
});
