const QuestionBank = require("../../../models/questionBank");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getQuestionBank = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const questionBank = await QuestionBank.findById(id)
      .populate("subject")
      .populate("exam");
  
    if (!questionBank) {
      return next(new AppError("No Question Bank found with that ID", 404));
    }
  
    res.status(200).json({
      status: true,
      data: {
        questionBank,
      },
    });
  });