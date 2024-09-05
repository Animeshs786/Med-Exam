const PreparationTest = require("../../../models/preparationTest");
const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.addPreparationTestQuestions = catchAsync(async (req, res, next) => {
  const { questions, preparationTestId } = req.body;

  const preparationTest = await PreparationTest.findById(preparationTestId);
  if (!preparationTest) {
    return next(new AppError("Preparation test not found.", 404));
  }

  for (const question of questions) {
    const newQuestion = await Question.findById(question);
    newQuestion.preparationTest.push(preparationTestId);
    await newQuestion.save();
  }

  res.status(201).json({
    status: true,
    message: "Add Question successfully.",
  });
});
