const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");

exports.createQuestion = catchAsync(async (req, res) => {
    
  const newQuestion = await Question.create(req.body);

  res.status(201).json({
    status: true,
    data: {
      question: newQuestion,
    },
  });
});
