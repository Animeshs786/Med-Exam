const PreparationTest = require("../../../models/preparationTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updatePreparationTest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
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
    course,
    testType,
    testSeries,
  } = req.body;

  let newThumbImage;

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

  if (req.files?.thumbImage) {
    newThumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  try {
    const mockTestData = {};

    if (name) mockTestData.name = name;
    if (instructions) mockTestData.instructions = JSON.parse(instructions);
    if (totalQuestions) mockTestData.totalQuestions = totalQuestions;
    if (totalMarks) mockTestData.totalMarks = totalMarks;
    if (minute) mockTestData.minute = minute;
    if (correctMark !== undefined) mockTestData.correctMark = correctMark;
    if (wrongMark !== undefined) mockTestData.wrongMark = wrongMark;
    if (language) mockTestData.language = language;
    if (subject) mockTestData.subject = subject;
    if (subjects)
      mockTestData.subjects =
        testType == "Full Test" ? JSON.parse(subjects) : [];
    if (exam) mockTestData.exam = exam;
    if (testType) mockTestData.testType = testType;
    if (testSeries) mockTestData.testSeries = testSeries;

    const existingMockTest = await PreparationTest.findById(id);
    if (!existingMockTest) {
      if (newThumbImage) await deleteOldFiles(newThumbImage);
      return next(new AppError("Preparation test not found", 404));
    }

    if (newThumbImage && existingMockTest.thumbImage) {
      await deleteOldFiles(existingMockTest.thumbImage);
      mockTestData.thumbImage = newThumbImage;
    }

    const updatedMockTest = await PreparationTest.findByIdAndUpdate(id, mockTestData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      message: "Preparation test updated successfully",
      data: {
        mockTest: updatedMockTest,
      },
    });
  } catch (error) {
    if (newThumbImage) await deleteOldFiles(newThumbImage);
    return next(error);
  }
});
