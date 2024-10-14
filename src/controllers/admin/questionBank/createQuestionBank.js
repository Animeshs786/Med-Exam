const QuestionBank = require("../../../models/questionBank");
const catchAsync = require("../../../utils/catchAsync");

// Create a Question Bank
exports.createQuestionBank = catchAsync(async (req, res) => {
  const {
    name,
    totalQuestions,
    language,
    subject,
    exam,
    minute,
    instructions,
  } = req.body;

  let thumbImage;
  if (req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const questionBank = await QuestionBank.create({
    name,
    totalQuestions,
    language,
    subject,
    exam,
    thumbImage,
    minute,
    instructions: instructions ? JSON.parse(instructions) : [],
  });

  res.status(201).json({
    status: true,
    message: "Question Bank created successfully.",
    data: {
      questionBank,
    },
  });
});
