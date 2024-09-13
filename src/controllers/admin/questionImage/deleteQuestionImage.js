const QuestionImage = require("../../../models/questionImage");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteQuestionImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const questionImage = await QuestionImage.findByIdAndDelete(id);

  if (!questionImage) {
    return res.status(404).json({
      status: false,
      message: "Question image not found.",
    });
  }

  res.status(200).json({
    status: true,
    message: "Question image delete successfully",
  });
});
