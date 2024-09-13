const Question = require("../../../models/question");
const SubmittedAnswer = require("../../../models/submittedAnswer");
const catchAsync = require("../../../utils/catchAsync");

exports.getMcqOfTheDay = catchAsync(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const userId = req.user._id;

  const mcqQuestions = await Question.find({
    isMcq: true,
    showAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const existingSubmission = await SubmittedAnswer.findOne({
    question: mcqQuestions[0]._id,
    user: userId,
    type: "MCQ",
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  res.status(200).json({
    status: true,
    message: "MCQ questions for the day fetched successfully.",
    data: mcqQuestions,
    isAttempted: existingSubmission ? true : false,
    givenAnswer: existingSubmission ? existingSubmission.answer : null,
  });
});
