const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.addQuestionToMcq = catchAsync(async (req, res, next) => {
  const { question, showAt } = req.body;

  const questionData = await Question.findById(question);
  if (!questionData) {
    return next(new AppError("Invalid Question id.", 404));
  }

  if (!showAt) return next(new AppError("Show Date must be required.", 400));

  const existingMcqQuestion = await Question.findOne({
    showAt: showAt,
    isMcq: true,
    _id: { $ne: question },
  });

  if (existingMcqQuestion) {
    return next(
      new AppError("Mcq Question already exists for same date.", 400)
    );
  }

  questionData.isMcq = true;
  questionData.showAt = showAt;

  await questionData.save();

  res.status(201).json({
    status: true,
    message: "Added Question successfully.",
  });
});
