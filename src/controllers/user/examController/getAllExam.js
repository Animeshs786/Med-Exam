const Exam = require("../../../models/exam");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllExam = catchAsync(async (req, res) => {
  const queryObj = { status: true };

  const exams = await Exam.find(queryObj);

  res.status(200).json({
    status: true,
    results: exams.length,
    message: "Retrieved exams successfully",
    data: {
      exams,
    },
  });
});
