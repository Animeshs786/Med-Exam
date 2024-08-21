const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createMockTest = catchAsync(async (req, res, next) => {
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
    price,
    isPaid,
    testType,
    testSeries,
    reAttempt
  } = req.body;

  let thumbImage;

  if (!testType) return next(new AppError("Please select test type", 400));

  if (!testSeries) return next(new AppError("Please select test series", 400));

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
    if (subjects || subject)
      return next(
        new AppError("In chapter test subjects or subject are not required", 400)
      );
  }
  if (req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const mockTest = await MockTest.create({
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
    price,
    isPaid,
    testType,
    testSeries,
    reAttempt,
  });

  res.status(201).json({
    status: true,
    message: "MockTest created successfully",
    data: {
      mockTest,
    },
  });
});
