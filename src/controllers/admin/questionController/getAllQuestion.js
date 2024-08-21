const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuestions = catchAsync(async (req, res) => {
  const { subject, search, mockTest } = req.query;
  const obj = {};
  if (subject) obj.subject = subject;
  if (search) obj.question = { $regex: search, $options: "i" };
  if (mockTest) obj.mockTest = mockTest;
  const questions = await Question.find(obj);

  res.status(200).json({
    status: true,
    results: questions.length,
    data: {
      questions,
    },
  });
});
