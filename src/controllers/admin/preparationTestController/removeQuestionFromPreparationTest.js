const PreparationTest = require("../../../models/preparationTest");
const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.removeQuestionFromPreparationTest = catchAsync(
  async (req, res, next) => {
    const { questionId, preparationTestId } = req.body;

    const preparationTest = await PreparationTest.findById(preparationTestId);
    if (!preparationTest) {
      return next(new AppError("Preparation test not found.", 404));
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return next(new AppError("Question not found.", 404));
    }

    question.preparationTest = question.preparationTest.filter(
      (id) => id.toString() !== preparationTestId
    );

    await question.save();
    res.status(200).json({
      status: true,
      message: "Question Removed Successfully.",
    });
  }
);
