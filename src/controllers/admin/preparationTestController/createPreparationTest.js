const PreparationTest = require("../../../models/preparationTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createPreparationTest = catchAsync(async (req, res, next) => {
  const {
    name,
    instructions,
    totalQuestions,
    totalMarks,
    minute,
    correctMark,
    wrongMark,
    language,
    subject,
    subjects,
    exam,
    testType,
    course,
  } = req.body;

  let thumbImage;

  if (!testType) return next(new AppError("Please select test type", 400));
  if (!course) return next(new AppError("Please select course", 400));

  if (testType == "Full Test") {
    if (subject)
      return next(new AppError("In full test subject are not required", 400));
    if (!subjects) return next(new AppError("Please select subjects", 400));
  }

  if (testType == "Subject Test") {
    if (subjects)
      return next(
        new AppError("In subject test subjects are not required", 400)
      );
    if (!subject) return next(new AppError("Please select subject", 400));
  }

  if (testType == "Chapter Test") {
    if (subjects)
      return next(
        new AppError("In Chapter test subjects are not required", 400)
      );
    if (!subject) return next(new AppError("Please select subject", 400));
  }
  if (req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const preparationTest = await PreparationTest.create({
    name,
    instructions: instructions ? JSON.parse(instructions) : [],
    totalQuestions,
    totalMarks,
    minute,
    correctMark,
    wrongMark,
    language,
    subject,
    subjects:
      testType == "Full Test" ? (subjects ? JSON.parse(subjects) : []) : [],
    thumbImage,
    exam,
    testType,
    course,
  });

  res.status(201).json({
    status: true,
    message: "Preparation test created successfully",
    data: {
      preparationTest,
    },
  });
});
