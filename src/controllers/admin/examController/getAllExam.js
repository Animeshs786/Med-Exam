const Exam = require("../../../models/exam");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllExam = catchAsync(async (req, res) => {
  const exams = await Exam.find();

  res.status(200).json({
    status: true,
    results: exams.length,
    data: {
      exams,
    },
  });
});
