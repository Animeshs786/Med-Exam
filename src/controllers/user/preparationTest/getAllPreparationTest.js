const PreparationTest = require("../../../models/preparationTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllPreparationTest = catchAsync(async (req, res, next) => {
  const { testType, search, subject, course } = req.query;
  if (!testType) return next(new AppError("Please provide test type", 400));

  let query = {};
  if (testType) {
    query.testType = testType.split("_").join(" ");
  }
  if (subject) query.subject = subject;
  if (course) query.course = course;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const preparationTest = await PreparationTest.find(query).select(
    "name thumbImage minute isPaid language"
  );

  res.status(200).json({
    status: true,
    results: preparationTest.length,
    data: {
      preparationTest,
    },
  });
});
