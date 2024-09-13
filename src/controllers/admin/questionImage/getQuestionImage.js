const QuestionImage = require("../../../models/questionImage");
const catchAsync = require("../../../utils/catchAsync");

exports.getQuestionImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const questionImage = await QuestionImage.findById(id);

  if (!questionImage) {
    return res.status(404).json({
      status: false,
      message: "Question image not found.",
    });
  }

  res.status(200).json({
    status: true,
    data: {
      questionImage,
    },
  });
});
