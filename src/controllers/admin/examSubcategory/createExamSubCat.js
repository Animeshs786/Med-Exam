const ExamSubCategory = require("../../../models/examSubCategory");
const catchAsync = require("../../../utils/catchAsync");

// Create a new ExamSubCategory
exports.createExamSubCategory = catchAsync(async (req, res) => {
  const { name, exam } = req.body;
  let thumbImage;

  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const newExamSubCategory = await ExamSubCategory.create({
    name,
    exam,
    thumbImage,
  });

  res.status(201).json({
    status: true,
    message: "ExamSubCategory created successfully",
    data: {
      examSubCategory: newExamSubCategory,
    },
  });
});
