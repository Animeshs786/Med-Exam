const QuestionBank = require("../../../models/questionBank");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuestionBank = catchAsync(async (req, res) => {
  const { search, subject } = req.query;

  let query = {};

  if (subject) query.subject = subject;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const questionBank = await QuestionBank.find(query)
    .select("name thumbImage minute isPaid language minute instructions")
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    results: questionBank.length,
    data: {
      questionBank,
    },
  });
});
