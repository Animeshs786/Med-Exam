const ExamSubCategory = require("../../../models/examSubCategory");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllExamSubCategories = catchAsync(async (req, res) => {
  const examSubCategories = await ExamSubCategory.find();

  res.status(200).json({
    status: true,
    results: examSubCategories.length,
    data: {
      examSubCategories,
    },
  });
});
