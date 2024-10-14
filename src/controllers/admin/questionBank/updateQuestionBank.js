const QuestionBank = require("../../../models/questionBank");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateQuestionBank = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    totalQuestions,
    language,
    subject,
    exam,
    minute,
    instructions,
  } = req.body;

  const questionBank = await QuestionBank.findById(id);
  if (!questionBank) {
    return next(new AppError("No Question Bank found with that ID", 404));
  }

  let updateData = { name, totalQuestions, language, subject, exam };

  // Update thumbnail image
  if (req.files?.thumbImage) {
    console.log(req.files?.thumbImage, "image");
    const oldThumbImage = questionBank.thumbImage;
    updateData.thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;

    // Delete old thumbnail image if it exists
    if (oldThumbImage) {
      await deleteOldFiles(oldThumbImage).catch((err) => {
        console.error("Failed to delete old thumbnail image:", err);
      });
    }
  }
  if (minute) updateData.minute = minute;
  if (instructions) updateData.instructions = JSON.parse(instructions);

  const updatedQuestionBank = await QuestionBank.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: true,
    message: "Question Bank updated successfully.",
    data: {
      questionBank: updatedQuestionBank,
    },
  });
});
