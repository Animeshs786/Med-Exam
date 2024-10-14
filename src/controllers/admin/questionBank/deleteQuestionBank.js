const QuestionBank = require("../../../models/questionBank");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteQuestionBank = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const questionBank = await QuestionBank.findById(id);
  
    if (!questionBank) {
      return next(new AppError("No Question Bank found with that ID", 404));
    }
  
    // Delete thumbnail image if it exists
    if (questionBank.thumbImage) {
      await deleteOldFiles(questionBank.thumbImage).catch((err) => {
        console.error("Failed to delete thumbnail image:", err);
      });
    }
  
    await QuestionBank.findByIdAndDelete(id);
  
    res.status(200).json({
      status: true,
      message: "Question Bank deleted successfully.",
      
    });
  });