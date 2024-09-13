const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");

exports.addRemoveMcq = catchAsync(async (req, res) => {
  const { questionId } = req.body;

  const questions = await Question.findById(questionId);

  if (questions.isMcq) questions.isMcq = false;
  else questions.isMcq = true;
  await questions.save();

  res.status(200).json({
    status: true,
    message: questions.isMcq
      ? "Question is now mcq"
      : "Question is remove from mcq",
  });
});
